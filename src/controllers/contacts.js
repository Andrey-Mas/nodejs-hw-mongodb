import createError from "http-errors";
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactByIdService,
  deleteContactByIdService,
} from "../services/contacts.js";

export async function getContactsController(req, res, next) {
  try {
    const data = await getAllContactsService();
    res.json({ status: 200, message: "Successfully found contacts!", data });
  } catch (err) {
    next(err);
  }
}

export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);
    if (!contact) throw createError(404, "Contact not found");
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}

// POST /contacts
export async function createContactController(req, res, next) {
  try {
    const { name, phoneNumber, contactType } = req.body;
    const missing = [];
    if (name == null) missing.push("name");
    if (phoneNumber == null) missing.push("phoneNumber");
    if (contactType == null) missing.push("contactType");
    if (missing.length) {
      throw createError(400, `Missing required fields: ${missing.join(", ")}`);
    }

    const created = await createContactService(req.body);
    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: created,
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /contacts/:contactId
export async function patchContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;
    const updated = await updateContactByIdService(contactId, req.body);
    if (!updated) throw createError(404, "Contact not found");
    res.json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /contacts/:contactId
export async function deleteContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;
    const deleted = await deleteContactByIdService(contactId);
    if (!deleted) throw createError(404, "Contact not found");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
