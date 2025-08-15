import { Contact } from '../models/contact.model.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  type,
  isFavourite,
}) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'asc' ? 1 : -1;

  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite) {
    filter.isFavourite = isFavourite === 'true';
  }

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(perPage),
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
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
