import mongoose from "mongoose";
import { Contact } from "../models/contact.js";

export async function getAllContactsService() {
  return Contact.find({});
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
