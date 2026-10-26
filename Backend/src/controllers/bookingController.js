const { bookings, timeSlots, counter } = require("../data/bookingsData")

function getTodayKey() {
    const now = new Date()
    let m = now.getMonth() + 1
    let d = now.getDate()
    if (m < 10) m = "0" + m
    if (d < 10) d = "0" + d
    return now.getFullYear() + "-" + m + "-" + d
}

function isSlotTaken(resource, date, label) {
    for (let i = 0; i < bookings.length; i++) {
        const b = bookings[i]
        const sameTime = b.startTime + "-" + b.endTime === label
        if (b.type === resource && b.date === date && sameTime && b.status === "confirmed") {
            return true
        }
    }
    return false
}

function isRealSlot(label) {
    for (let i = 0; i < timeSlots.length; i++) {
        if (timeSlots[i].label === label) {
            return true
        }
    }
    return false
}

function findBooking(id) {
    for (let i = 0; i < bookings.length; i++) {
        if (bookings[i].id === id) {
            return bookings[i]
        }
    }
    return undefined
}

function getSlots(req, res) {
    const resource = req.query.resource
    const date = req.query.date

    if (resource !== "desk" && resource !== "room") {
        return res.status(400).json({ error: "resource must be desk or room."})
    }
    if (!date) {
        return res.status(400).json({ error: "date is required."})
    }

    const result = []
    for (let i = 0; i < timeSlots.length; i++) {
        const taken = isSlotTaken(resource, date, timeSlots[i].label)
        result.push({
            id: timeSlots[i].id,
            label: timeSlots[i].label,
            available: !taken,
        })
    }
    res.json(result)
}

function getAllBookings(req, res) {
    res.json(bookings)
}

function getBookingsByDateAndResource(req, res) {
    const date = req.params.date
    const resource = req.params.resource

    const result = []
    for (let i = 0; i < bookings.length; i++) {
        const b = bookings[i]
        if (b.date === date && b.type === resource && b.status === "confirmed") {
            result.push(b)
        }
    }
    res.json(result)
}

function createBooking(req, res) {
    const resource = req.body.resource
    const date = req.body.date
    const slot = req.body.slot
    const name = req.body.name
    const email = req.body.email

    if (!resource || !date || !slot || !name || !email) {
        return res.status(400).json({ error:"Please fill in every field."})
    }
    if (resource !== "desk" && resource !== "room") {
        return res.status(400).json({ error: "resource must be desk or room"})
    }
    if ( !email.includes("@") || !email.includes(".")) {
        return res.status(400).json({ error: "Please enter a valid email address."})
    }
    if (date < getTodayKey()) {
        return res.status(400).json({ error: "You cannot book a date in the past."})
    }
    if ( !isRealSlot(slot)) {
        return res.status(400).json({ error: "That time slot does not exist."})
    }
    if (isSlotTaken(resource, Date, slot)) {
        return res.status(409).json({ error: "That time slot is already booked."})
    }

    const parts = slot.split("-")

    const newBooking = {
        id: counter.nextId,
        type: resource,
        resource: resource === "desk" ? "Desk" : "Meeting Room",
        location: "Floor 2",
        date: date,
        dateText: date,
        startTime: parts[0],
        endTime: parts[1],
        name: name,
        email: email,
        status: "confirmed",
        checkedIn: false,
    }
    counter. nextId = counter.nextId + 1

    bookings.push(newBooking)
    res.status(201).json(newBooking)
}

function cancelBooking(req, res) {
    const booking = findBooking(Number(req.params.id))

    if ( !booking ) {
        return res.status(404).json({ error: "Booking not found."})
    }

    booking.status = "cancelled"
    res.json(booking)
}

function checkInBooking(req, res) {
    const booking = findBooking(Number(req.params.id))

    if ( !booking) {
        return res.status(404).json({ error: "Booking not found."})
    }
    if (booking.status !== "confirmed") {
        return res.status(400).json({ error: "Only confirmed bookings can check in."})
    }
    booking.checkedIn = true
    res.json(booking)
}
module.exports ={
    getSlots,
    getAllBookings,
    getBookingsByDateAndResource,
    createBooking,
    cancelBooking,
    checkInBooking,
}