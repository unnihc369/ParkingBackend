const Parking = require('../models/parkingModel.js');
const ParkingLot = require('../models/parkinglotModel.js');

// Park a vehicle
const parkVehicle = async (req, res) => {
    const { slotNo, vehicleId, userId, parkingLotId } = req.body;

    try {
        // Check if the slot is already occupied
        const existingParking = await Parking.findOne({ slotNo, parkingLotId, isParked: true });
        if (existingParking) {
            return res.status(400).json({ error: 'Slot already occupied' });
        }

        // Check if the vehicle is already parked
        const existingVehicleParking = await Parking.findOne({ vehicleId, isParked: true });
        if (existingVehicleParking) {
            return res.status(400).json({ error: 'Vehicle is already parked' });
        }

        // Park the vehicle
        const parking = await Parking.create({
            slotNo,
            vehicleId,
            userId,
            parkingLotId,
            isParked: true,
            parkedAt: new Date()
        });
        res.status(201).json(parking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Depark a vehicle
const deparkVehicle = async (req, res) => {
    const { id } = req.params;

    try {
        const parking = await Parking.findById(id);
        if (!parking || !parking.isParked) {
            return res.status(404).json({ error: 'Vehicle not parked' });
        }

        const parkedDuration = (new Date() - new Date(parking.parkedAt)) / (1000 * 60 * 60); // Duration in hours
        const parkingLot = await ParkingLot.findById(parking.parkingLotId);
        const pricePerHour = parkingLot.pricePerHour;
        const charge = Math.ceil(parkedDuration) * pricePerHour;

        parking.isParked = false;
        parking.deparkedAt = new Date();
        await parking.save();

        res.status(200).json({ charge });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all parked vehicles
const getParkedVehicles = async (req, res) => {
    try {
        const parkedVehicles = await Parking.find({ isParked: true })
            .populate('vehicleId')
            .populate('userId')
            .populate('parkingLotId');
        res.status(200).json(parkedVehicles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    parkVehicle,
    deparkVehicle,
    getParkedVehicles
};
