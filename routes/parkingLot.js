const express = require('express');
const {
    addParkingLot,
    getParkingLots,
    editParkingLot,
    deleteParkingLot,
    getParkingLot
} = require('../controllers/parkinglotController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// router.use(requireAuth);

router.post('/', addParkingLot);
router.get('/', getParkingLots);
router.get('/:id', getParkingLot);
router.patch('/:id', editParkingLot);
router.delete('/:id', deleteParkingLot);

module.exports = router;
