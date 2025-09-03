import express from 'express';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const swaggerPath = path.resolve(__dirname, '../../docs/swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
