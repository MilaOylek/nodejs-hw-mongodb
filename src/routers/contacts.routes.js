import express from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
  handleCreateContact,
  handlePatchContact,
  handleDeleteContact,
} from '../controllers/contacts.controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(handleGetAllContacts));
router.get('/:contactId', ctrlWrapper(handleGetContactById));
router.post('/', ctrlWrapper(handleCreateContact));
router.patch('/:contactId', ctrlWrapper(handlePatchContact));
router.delete('/:contactId', ctrlWrapper(handleDeleteContact));

// router.get('/contacts', ctrlWrapper(handleGetAllContacts));
// router.get('/contacts/:contactId', ctrlWrapper(handleGetContactById));
// router.post('/contacts', ctrlWrapper(createContactController));
// router.patch('/contacts/:contactId', ctrlWrapper(updateContactController));
// router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
