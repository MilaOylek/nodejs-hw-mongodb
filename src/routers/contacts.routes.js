// import express from 'express';
// import {
//   handleGetAllContacts,
//   handleGetContactById,
//   handleCreateContact,
//   handlePatchContact,
//   upsertContactController,
//   handleDeleteContact,
// } from '../controllers/contacts.controller.js';
// import { ctrlWrapper } from '../utils/ctrlWrapper.js';
// import { isValidId } from '../middlewares/isValidId.js';
// import {
//   createContactSchema,
//   updateContactSchema,
// } from '../validation/contacts.validation.js';
// import { validateBody } from '../middlewares/validateBody.js';
// import { authenticate } from '../middlewares/authenticate.js';

// const router = express.Router();

// router.use(authenticate);

// router.get('/', ctrlWrapper(handleGetAllContacts));
// router.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));
// router.post(
//   '/',
//   validateBody(createContactSchema),
//   ctrlWrapper(handleCreateContact),
// );

// router.put(
//   '/:contactId',
//   isValidId,
//   validateBody(createContactSchema),
//   ctrlWrapper(upsertContactController),
// );

// router.patch(
//   '/:contactId',
//   isValidId,
//   validateBody(updateContactSchema),
//   ctrlWrapper(handlePatchContact),
// );

// router.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContact));

// export default router;

import express from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
  handleCreateContact,
  handlePatchContact,
  upsertContactController,
  handleDeleteContact,
} from '../controllers/contacts.controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.validation.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

console.log('✅ Contacts router initialized');

router.use(authenticate);

router.get('/', ctrlWrapper(handleGetAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(handleCreateContact),
);

router.put(
  '/:contactId',
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(handlePatchContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContact));

export default router;
