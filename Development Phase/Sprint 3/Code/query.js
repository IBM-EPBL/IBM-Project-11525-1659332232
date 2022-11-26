const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const querySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        // required: true
    }
});

module.exports = mongoose.model("Query", querySchema);