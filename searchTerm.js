const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Model
const searchTermSchema = new Schema(
    {
        searchVal: String,
        searcDate: Date
    },
    {timestamps: true}
);

const ModelClass = mongoose.model("searchTerm", searchTermSchema);

module.exports = ModelClass;