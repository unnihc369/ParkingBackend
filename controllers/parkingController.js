const Parking = require('../models/parkingModel.js');
const ParkingLot = require('../models/parkinglotModel.js');
const userModel = require('../models/userModel.js');
const Vehicle = require('../models/vehicleModel.js');
const nodemailer = require('nodemailer');

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

        // Update vehicle status
        const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, { isParked: true }, { new: true });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        // Fetch vehicle and parking lot details
        const vehicleDetails = await Vehicle.findById(vehicleId);
        const parkingLotDetails = await ParkingLot.findById(parkingLotId);

        if (!vehicleDetails || !parkingLotDetails) {
            return res.status(404).json({ error: 'Details not found' });
        }

        const user = await userModel.findById(userId);

        // Create transporter for sending email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "unnihc369@gmail.com",
                pass: "jgcl qrhg bcpz trzb",
            },
        });

        // Create email options with detailed information
        const mailOptions = {
            from: "unnihc369@gmail.com",
            to: user.email,
            subject: "Vehicle Parked Successfully!",
            text: `Dear ${user.username},

Your vehicle has been parked successfully.

Parking Details:
- Vehicle Name: ${vehicleDetails.carModel}
- Plate Number: ${vehicleDetails.plateNumber}
- Parking Lot: ${parkingLotDetails.name}
- Address: ${parkingLotDetails.address}
- Slot Number: ${slotNo}
- Price per Hour: ${parkingLotDetails.pricePerHour}

Thank you for using our Parking Service!

Best regards,
Parking Service Team
`
        };

        // Send the email
        await transporter.sendMail(mailOptions);

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
        if (!parking) {
            return res.status(404).json({ error: 'Vehicle not parked' });
        }

        const parkedDuration = (new Date() - new Date(parking.parkedAt)) / (1000 * 60 * 60); // Duration in hours
        const parkingLot = await ParkingLot.findById(parking.parkingLotId);
        const pricePerHour = parkingLot.pricePerHour;
        const charge = Math.ceil(parkedDuration) * pricePerHour;

        parking.isParked = false;
        parking.deparkedAt = new Date();
        await parking.save();

        const vehicle = await Vehicle.findByIdAndUpdate(parking.vehicleId, { isParked: false }, { new: true });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        const user = await userModel.findById(parking.userId);

        // Create transporter for sending email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "unnihc369@gmail.com",
                pass: "jgcl qrhg bcpz trzb",
            },
        });

        // Create email options with detailed information
        const mailOptions = {
            from: "unnihc369@gmail.com",
            to: user.email,
            subject: "Vehicle Deparked Successfully!",
            text: `Dear ${user.username},

Your vehicle has been successfully deparked.

Parking Details:
- Vehicle Name: ${vehicle.carModel}
- Plate Number: ${vehicle.plateNumber}
- Parking Lot: ${parkingLot.name}
- Address: ${parkingLot.address}
- Slot Number: ${parking.slotNo}
- Parked Duration: ${parkedDuration.toFixed(2)} hours
- Charge: ₹${charge}

Thank you for using our Parking Service!

Best regards,
Parking Service Team
`
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        await Parking.findByIdAndDelete(id);

        res.status(200).json({ charge, vehicle });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserParkedVehicles = async (req, res) => {
    const { id } = req.params;
    try {
        const parkedVehicles = await Parking.find({ userId: id }).populate('vehicleId');

        const response = parkedVehicles.map(parking => ({
            ...parking.toObject(),
            vehicle: parking.vehicleId // assuming vehicleId is populated with the vehicle details
        }));

        res.status(200).json(response);
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
    getParkedVehicles,
    getUserParkedVehicles
};
