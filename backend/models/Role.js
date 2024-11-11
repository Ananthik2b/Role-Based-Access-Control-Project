// models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    permissions: { type: [String], default:[],required: true },
});

module.exports = mongoose.model('Role', roleSchema);
