const express = require('express');
const {
    addVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// router.use(requireAuth);
router.post('/', addVehicle);
router.get('/:userId', getVehicles);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
