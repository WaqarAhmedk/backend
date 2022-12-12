const mongoose = require("mongoose");


const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "admin"
    },
    password: {
        type: String,
        required: true
    },

});

const adminmodel = mongoose.model("admin", AdminSchema);

module.exports = adminmodel;