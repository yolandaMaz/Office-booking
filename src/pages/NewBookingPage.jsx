import { useState } from "react";
import { Monitor, DoorOpen } from 'lucide-react';
import { bookings } from "../data/mockData";

function getDateKey(year, month, day) {
    let m = month + 1
    let d = day
    if (m < 10) m = "0" + m
    if (d < 10) d = "0" + d
    return year + "-" + m + "-" + d
}
    
     const timeSlots = [
         { id: 1, label: "9:00 AM - 10:00 AM"},
         { id: 2, label: "10:00 AM - 11:00 AM"},
         { id: 3, label: "11:00 AM - 12:00 PM"},
         { id: 4, label: "1:00 PM - 2:00 PM"},
         { id: 5, label: "2:00 PM - 3:00 PM"},
         { id: 6, label: "3:00 PM - 4:00 PM"},
        ]


function NewBookingPage() {
    const [resourceType, setResourceType] = useState("")

    const [ currentDate, setCurrentDate ] = useState(new Date())
    const [ selectedDate, setSelectedDate ] = useState("")
    const [ selectedSlot, setSelectedSlot ] = useState("")

    const [ fullName, setFullName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ message, setMessage ] = useState("")

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthName = currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    })

    const now = new Date()
    const todayKey = getDateKey(now.getFullYear(), now.getMonth(), now.getDate())

    const cells = []
    for (let i = 0; i < firstDay; i++) {
        cells.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push(day)
    }
    function previousMonth() {
        setCurrentDate(new Date(year, month - 1, 1))
    }
    function nextMonth() {
        setCurrentDate(new Date(year, month + 1, 1))
    }
    function isSlotTaken(label) {
        for (let i = 0; i < bookings.length; i++) {
            const b = bookings[i]
            const sameType = b.type === resourceType
            const sameDate = b.date === selectedDate
            const sameTime = b.startTime + "-" + b.endTime === label
            if (sameType && sameDate && sameTime && b.status === "confirmed") {
                return true
            }
        }
        return false
    }
    function confirmBooking() {
        if (resourceType === "" || email === "") {
            setMessage("Please enter your name and email.")
            return
        }
        if (!email.includes("@")) {
            setMessage("Please enter a valid email address.")
            return
        }
        const parts = selectedSlot.split("-")

        const newBooking = {
            id: bookings.length + 1,
            type: resourceType,
            resource: resourceType === "desk" ? "Desk" : "Meeting Room",
            location: "Floor 2",
            date: selectedDate,
            dateText: selectedDate,
            startTime: parts[0],
            endTime: parts[1],
            name: fullName,
            email: email,
            status: "confirmed",
        }
        bookings.push(newBooking)
        setMessage("Booking confirmed!")
        setSelectedSlot("")
        setFullName("")
        setEmail("")
    }

    let deskClass = 'flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left md:gap-4 md:p-4'
    if (resourceType === "desk") {
        deskClass = 'flex w-full items-center gap-3 rounded-xl border-2 border-blue-600 bg-blue-50 p-3 text-left md:gap-4 md:p-4'
    }

    let roomClass = 'flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left md:gap-4 md:p-4'
    if (resourceType === "room") {
        roomClass = 'flex w-full items-center gap-3 rounded-xl border-2 border-blue-600 bg-blue-50 p-3 text-left md:gap-4 md:p-4'
    }

    return(
        <div>
            <h2 className="mb-1 text-xl font-bold md:text-2xl">New Booking</h2>
            <p className="mb-4 text-sm text-gray-600 md:mb-6 md:text-base">
                Choose what you want to book.
            </p>

            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
                <section className="rounded-2xl border bg-white p-4 md:p-5">
                    <h3 className="mb-3 text-base font-semibold md:mb-4 md:text-lg">
                        1. Select Resource
                    </h3>

                    <div className="flex flex-col gap-3">
                        <button onClick={() => setResourceType("desk")} className={deskClass}>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 md:h-12 md:w-12">
                                <Monitor />
                            </div>
                            <div>
                                <p className="font-semibold">Desk</p>
                                <p className="text-xs text-gray-600 md:text-sm">Hot Desk</p>
                                <p className="text-xs text-gray-500 md:text-sm">
                                    A dedicated desk for focused work.
                                </p>
                            </div>
                        </button>

                        <button onClick={() => setResourceType("room")} className={roomClass}>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 md:h-12 md:w-12">
                                <DoorOpen />
                            </div>
                            <div>
                                <p className="font-semibold">Meeting Room</p>
                                <p className="text-xs text-gray-600 md:text-sm">Conference Room</p>
                                <p className="text-xs text-gray-500 md:text-sm">
                                    A private space for collaboration.
                                </p>
                            </div>
                        </button>
                    </div>
                </section>

                <section className="rounded-2-xl border bg-white p-4 md:p-5">
                    <h3 className="mb-3 text-base font-semibold md:mb-4 md:text-lg">
                        2. Choose Date
                    </h3>

                    <div className="mb-2 flex items-center justify-between md:mb-4">
                        <button onClick={previousMonth} className="px-3 py-1 hover:bg-gray-100">
                            &lt;
                        </button>
                        <p className="text-sm font-semibold md:text-base">{monthName}</p>
                        <button onClick={nextMonth} className="px-3 py-1 hover:bg-gray-100">
                            &gt;
                        </button>
                    </div>

                    <div className="grid grid-cols-7 text-center text-[10px] text-gray-500 md:text-xs">
                        <div className="py-1 md:py-2">SUN</div>
                        <div className="py-1 md:py-2">MON</div>
                        <div className="py-1 md:py-2">TUE</div>
                        <div className="py-1 md:py-2">WED</div>
                        <div className="py-1 md:py-2">THU</div>
                        <div className="py-1 md:py-2">FRI</div>
                        <div className="py-1 md:py-2">SAT</div>
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs md:text-sm">
                        {cells.map((day, index) => {
                            if (day === null) {
                                return <div key={index}></div>
                            }

                            const key = getDateKey(year, month, day)
                            const isPast = key < todayKey
                            const isSelected = key === selectedDate

                            let dayClass = "flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 md:w-10 md:h-10"
                            if (isSelected) {
                                dayClass = "flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white md:h-10 md:w-10"
                            }
                            if (isPast) {
                                dayClass = "flex h-8 w-8 items-center justify-center rounded-full text-gray-300 md:h-10 md:w-10"
                            }
                            return(
                                <div key={index} className="flex justify-center py-0.5 md:py-1">
                                    <button 
                                    disabled={isPast}
                                    onClick={() => setSelectedDate(key)} className={dayClass} >
                                        {day}
                                    </button>
                                    </div>
                            )
                        })}
                    </div>
                </section>

                <section className="rounded-2xl border bg-white p-4 md:p-5">
                    <h3 className="mb-1 text-base font-semibold md:text-lg">
                        3. Available Time Slots
                    </h3>
                    {selectedDate === "" || resourceType === "" ? (
                        <p className="text-sm text-gray-500">
                            Choose a resource and a date to see the times.
                        </p>
                    ):(
                        <div>
                            <p className="mb-3 text-sm text-gray-600">{selectedDate}</p>

                            <div className="flex flex-col gap-2">
                                {timeSlots.map((slot) => {
                                    const taken = isSlotTaken(slot.label)
                                    const chosen = selectedSlot === slot.label 

                                    let slotClass = "w-full rounded-lg border bg-white px-3 py-2 text-left text-sm hover:bg-gray-50 md:py-3 md:text-base"
                                    if (chosen) {
                                        slotClass = "w-full rounded-lg border-2 border-blue-600 bg-blue-50 px-3 py-2 text-left text-sm text-blue-700 md:px-4 md:py-3 md:text-base"
                                    }
                                    if (taken) {
                                        slotClass = "w-full rounded-lg border bg-gray-100 px-3 py-2 text-left text-sm text-gray-400 md:px-4 md;py-3 md:text-base"
                                    }

                                    return(
                                        <button
                                        key={slot.id}
                                        disabled={taken}
                                        onClick={() => setSelectedSlot(slot.label)}
                                        className={slotClass}>
                                            {slot.label}
                                            {taken && " (Booked)"}
                                        </button>
                                    )
                                 })}
                            </div>
                        </div>
                    )
                        }
                </section>
            </div>
            <section className="mt-4 rounded-2xl border bg-white p-4 md:mt-6 md:p-5">
                <h3 className="mb-3 text-base font-semibold md:mb-4 md:text-lg">
                     Your Details
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                    <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm md:px-4 md:py-3 md:text-base" />

                    <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm md:px-4 md:py-3 md:text-base" />
                </div>
                {message !== "" && (
                    <p className="mt-3 text-sm text-gray-700 md:text-base">{message}</p>
                )}
                <button onClick={confirmBooking} className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 md:w-auto md:px-8">
                    Confirm Booking
                </button>
            </section>
        </div>
    )
}

export default NewBookingPage