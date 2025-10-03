import { Contact } from "../models/contact.js";

export async function getAllContactsService() {
  const contacts = await Contact.find({});
  return contacts;
}

export async function getContactByIdService(contactId) {
  const contact = await Contact.findById(contactId);
  return contact; // може бути null — це ок, обробимо в контролері
}
