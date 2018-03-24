const mongoose = require('mongoose');

const partyMemberSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    partyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true }
});

module.exports = mongoose.model('PartyMember', partyMemberSchema);