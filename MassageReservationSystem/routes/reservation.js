const { createReservation, getReservations, updateReservation, deleteReservation, getReservation } = require("../controllers/reservationController");
const { protect ,authorize } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/",protect,authorize('admin','user'),createReservation)
        .get("/",protect,getReservations)
router.route("/:id")
        .get(protect,authorize('admin','user'),getReservation)
        .put(protect,authorize('admin','user'),updateReservation)
        .delete(protect,authorize('admin','user'),deleteReservation)


module.exports = router; 