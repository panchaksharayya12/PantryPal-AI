import React, { useEffect, useRef } from 'react';

interface ShaderBackgroundProps {
  isDark?: boolean;
}

export const ShaderBackground: React.FC<ShaderBackgroundProps> = ({ isDark = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let gl: WebGLRenderingContext | null = null;
    let isWebGL = true;

    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch (e) {
      isWebGL = false;
    }

    if (!gl) {
      isWebGL = false;
    }

    // Mouse coordinates in normalized space
    let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX / window.innerWidth;
      mouse.targetY = 1.0 - (e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    if (isWebGL && gl) {
      // Vertex Shader
      const vsSource = `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Fragment Shader: Organic Simplex Warping with Dynamic Dark/Light Palette
      const fsSource = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_time;
        uniform float u_dark;

        // Simplex 2D noise helpers
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          st.x *= u_resolution.x / u_resolution.y;

          float t = u_time * 0.08;
          vec2 mouseEffect = u_mouse * 0.15;

          // Domain Warping Layers
          float distToMouse = length(st - u_mouse * vec2(u_resolution.x/u_resolution.y, 1.0));
          vec2 q = vec2(
            snoise(st * 0.8 + vec2(t * 0.5, t * 0.3) + mouseEffect),
            snoise(st * 0.8 + vec2(-t * 0.4, t * 0.2))
          );

          vec2 r = vec2(
            snoise(st * 1.2 + 2.0 * q + vec2(t * 0.4, -t * 0.2) + (1.0 - smoothstep(0.0, 0.6, distToMouse)) * 0.2),
            snoise(st * 1.2 + 2.0 * q + vec2(-t * 0.3, t * 0.5))
          );

          float f = snoise(st + 3.0 * r);

          // Palettes:
          // Light Mode
          vec3 light_c1 = vec3(0.980, 0.972, 0.949); // #FAF8F2
          vec3 light_c2 = vec3(0.898, 0.941, 0.898); // #E6F0E6
          vec3 light_c3 = vec3(0.192, 0.361, 0.263); // #315C43
          vec3 light_c4 = vec3(0.973, 0.925, 0.878); // #F8ECE0

          // Dark Mode: Deep obsidian, dark emerald, glowing emerald aura
          vec3 dark_c1 = vec3(0.043, 0.059, 0.047);  // #0B0F0C
          vec3 dark_c2 = vec3(0.063, 0.118, 0.082);  // #101E15
          vec3 dark_c3 = vec3(0.063, 0.725, 0.506);  // #10B981 emerald
          vec3 dark_c4 = vec3(0.118, 0.086, 0.039);  // warm saffron glow

          vec3 c1 = mix(light_c1, dark_c1, u_dark);
          vec3 c2 = mix(light_c2, dark_c2, u_dark);
          vec3 c3 = mix(light_c3, dark_c3, u_dark);
          vec3 c4 = mix(light_c4, dark_c4, u_dark);

          // Color blending
          vec3 color = mix(c1, c2, clamp(f * f * 2.5, 0.0, 1.0));
          color = mix(color, c4, clamp(length(q) * 0.6, 0.0, 1.0));
          color = mix(color, c3, clamp(length(r.x) * (u_dark > 0.5 ? 0.08 : 0.12), 0.0, 0.22));

          // Vignette
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
          vignette = clamp(pow(16.0 * vignette, 0.15), 0.0, 1.0);

          gl_FragColor = vec4(color, (u_dark > 0.5 ? 0.92 : 0.75) * vignette + 0.15);
        }
      `;

      const createShader = (type: number, source: string) => {
        const shader = gl!.createShader(type);
        if (!shader) return null;
        gl!.shaderSource(shader, source);
        gl!.compileShader(shader);
        if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
          console.error(gl!.getShaderInfoLog(shader));
          gl!.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

      if (vs && fs) {
        const program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);
          gl.useProgram(program);

          // Fullscreen quad
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
          );

          const posLoc = gl.getAttribLocation(program, 'position');
          gl.enableVertexAttribArray(posLoc);
          gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

          const resLoc = gl.getUniformLocation(program, 'u_resolution');
          const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
          const timeLoc = gl.getUniformLocation(program, 'u_time');
          const darkLoc = gl.getUniformLocation(program, 'u_dark');

          let startTime = performance.now();

          const render = (time: number) => {
            // Smooth mouse interpolation
            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            const elapsed = (time - startTime) * 0.001;
            gl!.uniform2f(resLoc, canvas.width, canvas.height);
            gl!.uniform2f(mouseLoc, mouse.x, mouse.y);
            gl!.uniform1f(timeLoc, elapsed);
            gl!.uniform1f(darkLoc, isDarkRef.current ? 1.0 : 0.0);

            gl!.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
          };

          animationFrameId = requestAnimationFrame(render);
        }
      }
    } else {
      // 2D Canvas Fallback
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const render2D = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = isDarkRef.current ? '#0B0F0D' : '#FAF8F2';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          animationFrameId = requestAnimationFrame(render2D);
        };
        animationFrameId = requestAnimationFrame(render2D);
      }
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 transition-opacity duration-700"
      style={{
        opacity: isDark ? 0.95 : 0.65,
      }}
    />
  );
};
