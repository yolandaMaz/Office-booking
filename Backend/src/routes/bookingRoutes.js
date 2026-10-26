const express = require("express")
const controller = require("../controllers/bookingController")

const router = express.Router()

router.get("/slots", controller.getSlots)
router.get("/bookings", controller.getAllBookings)
router.get("/bookings/:date/:resource", controller.getBookingsByDateAndResource)
router.post("/bookings", controller.createBooking)
router.delete("/bookings/:id", controller.cancelBooking)
router.patch("/bookings/:id/checkin", controller.checkInBooking)

module.exports = router