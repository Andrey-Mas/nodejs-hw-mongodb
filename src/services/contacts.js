import mongoose from "mongoose";
import { Contact } from "../models/contact.js";

export async function getAllContactsService(options = {}) {
  const {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    filters = {},
  } = options;

  const query = {};

  if (typeof filters.isFavourite === "boolean") {
    query.isFavourite = filters.isFavourite;
  }

  if (filters.contactType) {
    query.contactType = filters.contactType;
  }

  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  const [data, totalItems] = await Promise.all([
    Contact.find(query).sort(sort).skip(skip).limit(perPage),
    Contact.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
}

export async function getContactByIdService(contactId) {
  if (!mongoose.isValidObjectId(contactId)) return null;
  return Contact.findById(contactId);
}

export async function createContactService(payload) {
  const created = await Contact.create(payload);
  return created;
}

export async function updateContactByIdService(contactId, payload) {
  if (!mongoose.isValidObjectId(contactId)) return null;
  const updated = await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
    runValidators: true,
  });
  return updated;
}

export async function deleteContactByIdService(contactId) {
  if (!mongoose.isValidObjectId(contactId)) return null;
  const deleted = await Contact.findByIdAndDelete(contactId);
  return deleted;
}