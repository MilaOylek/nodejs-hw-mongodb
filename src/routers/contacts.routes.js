import express from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
  handleCreateContact,
  handlePatchContact,
  handleDeleteContact,
} from '../controllers/contacts.controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.validation.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();

router.get('/', ctrlWrapper(handleGetAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));

router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(handleCreateContact),
);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(handlePatchContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContact));

export default router;
