import mongoose from "mongoose";
import { Contact } from "../models/contact.js";

export async function getAllContactsService() {
  return Contact.find({});
}

export async function getContactByIdService(contactId) {
  // якщо id не валідний — одразу “нема”
  if (!mongoose.isValidObjectId(contactId)) {
    return null;
  }
  return Contact.findById(contactId);
}
