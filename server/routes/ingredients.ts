import { Router, Request, Response } from 'express';
import multer from 'multer';
import { aiService } from '../services/aiService';

const router = Router();

// Store file in memory to avoid permanent disk clutter
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are supported.'));
    }
  }
});

// POST /api/ingredients/identify
router.post('/identify', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        ingredients: [],
        message: 'No image file uploaded. Please upload a valid food or pantry photograph.'
      });
      return;
    }

    const imageBase64 = req.file.buffer.toString('base64');
    const result = await aiService.identifyIngredientsFromImage(imageBase64, req.file.mimetype);

    res.json(result);
  } catch (error: any) {
    console.error('Error identifying ingredients:', error);
    res.status(500).json({
      success: false,
      ingredients: [],
      message: error?.message || 'Error processing uploaded image'
    });
  }
});

export default router;

