import {
  getAllContactsService,
  getContactByIdService,
} from "../services/contacts.js";

export async function getContactsController(req, res, next) {
  try {
    const data = await getAllContactsService();
    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    // У цій ДЗ припускається валідний MongoDB ID, тож тут — загальна помилка
    next(err);
  }
}
