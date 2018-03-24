const mongoose = require('mongoose');

const partySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    floor: { type: Number, required: true }
});

module.exports = mongoose.model('Party', partySchema);