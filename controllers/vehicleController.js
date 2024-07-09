const Vehicle = require('../models/vehicleModel.js');
const mongoose = require('mongoose');

const addVehicle = async (req, res) => {
    const { plateNumber, carModel ,userId } = req.body;

    try {
        const vehicle = await Vehicle.create({ plateNumber, carModel, userId });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getVehicles = async (req, res) => {
    const {userId} = req.params;
    console.log(userId)

    try {
        const vehicles = await Vehicle.find({ userId });
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { plateNumber, carModel,userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such vehicle' });
    }

    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: id, userId },
            { plateNumber, carModel },
            { new: true, runValidators: true }
        );

        if (!vehicle) {
            return res.status(404).json({ error: 'No such vehicle' });
        }

        res.status(200).json(vehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteVehicle = async (req, res) => {
    const { id } = req.params;
    const {userId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such vehicle' });
    }

    try {
        const vehicle = await Vehicle.findOneAndDelete({ _id: id, userId });

        if (!vehicle) {
            return res.status(404).json({ error: 'No such vehicle' });
        }

        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle
};
