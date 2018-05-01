const mongoose = require('mongoose');

const battlefieldSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    partyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true, unique: true },
    floor: { type: Number, required: true },
    turnNo: { type: Number, required: true },
    playersMultiplier: { type: Number, required: true },
    enemiesMultiplier: { type: Number, required: true },
    actors: {}
});

// battlefieldSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
//     const self = this;
//     self.findOne(condition, (err, result) => {
//         return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) })
//     })
// }

// Battlefield.findOneOrCreate({ key: 'value' }, (err, page) => {
//     // ... code
//     console.log(page);
// });


module.exports = mongoose.model('Battlefield', battlefieldSchema);