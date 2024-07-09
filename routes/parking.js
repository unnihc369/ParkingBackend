const express = require('express');
const {
    parkVehicle,
    deparkVehicle,
    getParkedVehicles
} = require('../controllers/parkingController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// router.use(requireAuth);

router.post('/park', parkVehicle);
router.post('/depark/:id', deparkVehicle);
router.get('/', getParkedVehicles);

module.exports = router;
