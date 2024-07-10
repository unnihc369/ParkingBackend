const ParkingLot = require('../models/parkinglotModel.js');
const Parking = require('../models/parkingModel.js');
const Vehicle = require('../models/vehicleModel.js');

// Add a new parking lot
const addParkingLot = async (req, res) => {
    const { name, address, noOfSlots, pricePerHour } = req.body;

    try {
        const parkingLot = await ParkingLot.create({ name, address, noOfSlots, pricePerHour });
        res.status(201).json(parkingLot);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getParkingLot = async (req, res) => {
    const { id } = req.params; 

    try {
        const parkingLot = await ParkingLot.findById(id);
        if (!parkingLot) {
            return res.status(404).json({ error: 'Parking lot not found' });
        }

        const occupiedVehicles = await Parking.find({ parkingLotId: id});
        const occupiedSlots = occupiedVehicles.map(vehicle => vehicle.slotNo);

        res.status(200).json({ parkingLot, occupiedSlots });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all parking lots
const getParkingLots = async (req, res) => {
    try {
        const parkingLots = await ParkingLot.find({});
        res.status(200).json(parkingLots);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit a parking lot
const editParkingLot = async (req, res) => {
    const { id } = req.params;
    const { name, address, noOfSlots, pricePerHour } = req.body;

    try {
        const parkingLot = await ParkingLot.findByIdAndUpdate(id, { name, address, noOfSlots, pricePerHour }, { new: true });
        if (!parkingLot) {
            return res.status(404).json({ error: 'Parking lot not found' });
        }
        res.status(200).json(parkingLot);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a parking lot
const deleteParkingLot = async (req, res) => {
    const { id } = req.params;

    try {
        const parkingLot = await ParkingLot.findByIdAndDelete(id);
        if (!parkingLot) {
            return res.status(404).json({ error: 'Parking lot not found' });
        }
        res.status(200).json({ message: 'Parking lot deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addParkingLot,
    getParkingLots,
    editParkingLot,
    deleteParkingLot,
    getParkingLot
};
