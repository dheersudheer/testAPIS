const mongoose = require("mongoose");

const Pendingactions = mongoose.model(
  "Pendingactions",
  new mongoose.Schema(
    {
      user_id: {
        type: String,
        required: true,

      },
      request_object: {
        type: Object,
        required: true,
      },
      request_action: {
        type: String,
        required: true,

      },
      request_module: {
        type: String,
        required: true,

      },
      status: {
        type: String,
        required: true,

      }
    },
    { timestamps: true }
  )
);
module.exports = Pendingactions;

