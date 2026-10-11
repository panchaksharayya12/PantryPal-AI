import app from './app';
import { getDb } from './database/db';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Start Server and Initialize Database
async function startServer() {
  try {
    console.log('Initializing PantryPal AI database...');
    await getDb();
    console.log('Database initialized and ready.');

    app.listen(PORT, () => {
      console.log(`\n===========================================`);
      console.log(`  PantryPal AI Server running on port ${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===========================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
