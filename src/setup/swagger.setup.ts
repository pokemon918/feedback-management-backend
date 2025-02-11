import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import * as YAML from 'yamljs';
import path from 'path';
import { Logger } from '@/utils';

export const swaggerSetup = (app: Express) => {
  try {
    const swaggerPath = path.join(__dirname, '../../swagger.yaml');
    const swaggerDocument = YAML.load(swaggerPath);
    
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    Logger.info('Swagger documentation initialized at /api-docs');
  } catch (error) {
    Logger.error('Failed to initialize Swagger documentation:', error);
  }
}; 