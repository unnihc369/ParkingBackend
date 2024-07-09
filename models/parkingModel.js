const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkingSchema = new Schema({
    slotNo: {
        type: Number,
        required: true
    },
    vehicleId: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parkingLotId: {
        type: Schema.Types.ObjectId,
        ref: 'ParkingLot',
        required: true
    },
    isParked: {
        type: Boolean,
        default: true
    },
    parkedAt: {
        type: Date,
        required: true
    },
    deparkedAt: {
        type: Date
    }
});

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;
