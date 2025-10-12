import { authenticate } from "../middlewares/authenticate.js";
import { Router } from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactByIdController,
  deleteContactByIdController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { createContactSchema, updateContactSchema } from "../validation/contactSchemas.js";

const router = Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getContactsController));

router.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

router.post("/", validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch("/:contactId", isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactByIdController));

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactByIdController));

export default router;