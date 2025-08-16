import { Contact } from '../models/contact.model.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === SORT_ORDER.ASC ? 1 : -1;

  const contactsQuery = Contact.find(filter);

  const totalItems = await Contact.countDocuments(filter);

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortDirection })
    .exec();

  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (contactId, updateData) => {
  return await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
