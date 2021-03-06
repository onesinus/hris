const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    description: {type: String, unique: true, required: true},
    permit_total: {type: Number, required: true}
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("SpecialLeave", DataSchema);
