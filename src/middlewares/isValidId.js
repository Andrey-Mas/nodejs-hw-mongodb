import mongoose from "mongoose";

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (contactId && !mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid id format",
      data: { contactId },
    });
  }
  next();
};