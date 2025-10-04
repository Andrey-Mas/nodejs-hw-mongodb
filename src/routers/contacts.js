import { Router } from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactByIdController,
  deleteContactByIdController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.get("/", ctrlWrapper(getContactsController));
router.get("/:contactId", ctrlWrapper(getContactByIdController));
router.post("/", ctrlWrapper(createContactController));
router.patch("/:contactId", ctrlWrapper(patchContactByIdController));
router.delete("/:contactId", ctrlWrapper(deleteContactByIdController));

export default router;
