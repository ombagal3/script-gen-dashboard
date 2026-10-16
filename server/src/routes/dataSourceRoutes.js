import express from 'express';
import * as dataSourceController from '../controllers/dataSourceController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalAuth);

router.get('/', dataSourceController.getDataSources);
router.post('/:provider/test', dataSourceController.testDataSource);
router.post('/:provider/sync', dataSourceController.syncDataSource);
router.post('/:provider/configure', dataSourceController.configureDataSource);
router.delete('/:provider', dataSourceController.disconnectDataSource);

export default router;
