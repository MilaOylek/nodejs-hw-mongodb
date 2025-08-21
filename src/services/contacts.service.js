import { Contact } from '../models/contact.model.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async (
  {
    page = 1,
    perPage = 10,
    sortBy = '_id',
    sortOrder = SORT_ORDER.ASC,
    filter = {},
  },
  userId,
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === SORT_ORDER.ASC ? 1 : -1;

  const contactsQuery = Contact.find({ ...filter, userId });

  const totalItems = await Contact.countDocuments({ ...filter, userId });

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

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData, userId) => {
  return await Contact.create({ ...contactData, userId });
};

export const updateContact = async (contactId, updateData, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true },
  );
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
