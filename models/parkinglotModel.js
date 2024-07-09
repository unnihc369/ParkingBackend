const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkingLotSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    noOfSlots: {
        type: Number,
        required: true
    },
    pricePerHour: {
        type: Number,
        required: true
    }
});

const ParkingLot = mongoose.model('ParkingLot', parkingLotSchema);

module.exports = ParkingLot;
