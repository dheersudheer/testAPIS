const mongoose = require("mongoose");

const Invite = mongoose.model(
  "Invite",
  new mongoose.Schema(
    {
      invited_by: {
        type: String,
        required: true
      },
      invitation_to: {
        type: String,
        required: true,
        max: 200,
      },
      invitation_link: {
        type: String,
        required: true,
        unique: true
      },
      status: {
        type: String,
        required: true
      },
    },
    { timestamps: true }
  )
);
module.exports = Invite;

