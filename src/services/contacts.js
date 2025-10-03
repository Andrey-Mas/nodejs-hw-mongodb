import mongoose from "mongoose";
import { Contact } from "../models/contact.js";

export async function getAllContactsService() {
  return Contact.find({});
}

export async function getContactByIdService(contactId) {
  // якщо id не валідний — повертаємо null, щоб контролер віддав 404
  if (!mongoose.isValidObjectId(contactId)) {
    return null;
  }
  return Contact.findById(contactId);
}
