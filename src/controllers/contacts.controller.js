import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  upsertContact,
} from '../services/contacts.service.js';
import createError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const handleGetAllContacts = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { type, isFavourite } = req.query;
  const userId = req.user._id;

  const filter = {};

  if (isFavourite) {
    filter.isFavourite = isFavourite === 'true';
  }

  if (type) {
    filter.type = type;
  }

  const contacts = await getAllContacts(
    {
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    },
    userId,
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const handleGetContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const handleCreateContact = async (req, res) => {
  const userId = req.user._id;
  const newContact = await createContact(req.body, userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const handlePatchContact = async (req, res) => {
  const { contactId } = req.params;
  const updates = req.body;
  const userId = req.user._id;

  const updatedContact = await updateContact(contactId, updates, userId);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const handleDeleteContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deleted = await deleteContact(contactId, userId);
  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const result = await upsertContact(contactId, req.body, userId);

  if (!result) {
    throw createError(404, 'Contact not found');
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status: status,
    message: 'Successfully upserted contact!',
    data: result.contact,
  });
};
