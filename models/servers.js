const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    index: Number,
    list: mongoose.Schema.Types.Array,
    next: Number,
    total: Number
});

const Servers = mongoose.model("server", serverSchema);
module.exports = Servers; 
