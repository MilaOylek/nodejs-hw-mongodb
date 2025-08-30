import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();
    console.log('✅ MongoDB connected');

    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    console.log('✅ Upload dirs checked/created');

    console.log('🚀 Starting server...');
    setupServer();
  } catch (error) {
    console.error('❌ Failed to bootstrap the application:', error);
    process.exit(1);
  }
};

bootstrap();
