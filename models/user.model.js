const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      first_name: {
        type: String,
        required: true,
        max: 200,
      },
      last_name: {
        type: String,
        required: true,
        max: 200,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        min: 5
      },
      role: {
        type: String,
        default: 'basic',
        enum: ["basic", "SuperAdmin", "admin"]
       },
    },
    { timestamps: true }
  )
);
module.exports = User;

/*module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
          title: String,
          description: String,
          published: Boolean
        },
        { timestamps: true }
      );
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });
    
      const User = mongoose.model("User", schema);
    return User;
  };*/
