import createError from "http-errors";
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactByIdService,
  deleteContactByIdService,
} from "../services/contacts.js";

// GET /contacts
export async function getContactsController(req, res) {
  const {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavourite,
  } = req.query;

  const numericPage = Math.max(1, parseInt(page, 10) || 1);
  const numericPerPage = Math.max(1, Math.min(100, parseInt(perPage, 10) || 10));

  const filters = {};
  if (typeof isFavourite !== "undefined") {
    if (isFavourite === "true" || isFavourite === true) filters.isFavourite = true;
    else if (isFavourite === "false" || isFavourite === false) filters.isFavourite = false;
  }
  if (type) filters.contactType = type;

  const data = await getAllContactsService({
    page: numericPage,
    perPage: numericPerPage,
    sortBy,
    sortOrder,
    filters,
  });

  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
}

// GET /contacts/:contactId
export async function getContactByIdController(req, res) {
  const { contactId } = req.params;
  const data = await getContactByIdService(contactId);
  if (!data) throw createError(404, "Contact not found");
  res.json({ status: 200, message: "Successfully found contact!", data });
}

// POST /contacts
export async function createContactController(req, res) {
  const data = await createContactService(req.body);
  res.status(201).json({ status: 201, message: "Successfully created contact!", data });
}

// PATCH /contacts/:contactId
export async function patchContactByIdController(req, res) {
  const { contactId } = req.params;
  const data = await updateContactByIdService(contactId, req.body);
  if (!data) throw createError(404, "Contact not found");
  res.json({ status: 200, message: "Successfully patched contact!", data });
}

// DELETE /contacts/:contactId
export async function deleteContactByIdController(req, res) {
  const { contactId } = req.params;
  const data = await deleteContactByIdService(contactId);
  if (!data) throw createError(404, "Contact not found");
  res.status(204).send();
}