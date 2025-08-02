import { Router } from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(handleGetAllContacts));
router.get('/contacts/:contactId', ctrlWrapper(handleGetContactById));
router.post('/contacts', ctrlWrapper(createContactController));
router.patch('/contacts/:contactId', ctrlWrapper(updateContactController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
