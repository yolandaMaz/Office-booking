const bookings = []

const timeSlots = [
    {id: 1, label: "9:00 AM - 10:00 AM"},
    {id: 2, label: "10:00 AM - 11:00 AM"},
    {id: 3, label: "11:00 AM - 12:00 AM"},
    {id: 4, label: "1:00 PM - 2:00 PM"},
    {id: 5, label: '2:00 PM - 3:00 PM'},
    {id: 6, label: "3:00 PM - 4:00 PM"},
]

const counter ={ nextId: 1}

module.exports={ bookings, timeSlots, counter }