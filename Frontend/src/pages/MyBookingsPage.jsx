import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Monitor, DoorOpen, Calendar, Clock,X, Check, Plus, CheckCircle, XCircle } from "lucide-react"


function getDateKey(year, month, day) {
    let m = month + 1
    let d = day
    if (m < 10) m = "0" + m
    if (d < 10) d = "0" + d
    return year + "-" + m + "-" + d
}

const now = new Date()
const todayKey = getDateKey(now.getFullYear(), now.getMonth(), now.getDate())

function MyBookingsPage() {
    const [ activeTab, setActiveTab ] = useState("upcoming")
    
    const [backendData, setBackendData] = useState([]);
    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL;
        fetch(`${API_URL}/api/bookings`)
        .then((res) => res.json())
        .then((data) => {
            setBackendData(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("API Error on bookings page:", err));
    }, []);

    function cancelBooking(id) {
        if (!window.confirm("Are you sure you want to cancel this booking?"))
            return;

        const API_URL = import.meta.env.VITE_API_URL;

        fetch(`${API_URL}/api/bookings/${id}`, {
            method: "DELETE",
        })
        .then((res) => {
            if (!res.ok) throw new Error("Failed to delete booking from database");
            return res.json();
        })
        .then(() => {
            fetch(`${API_URL}/api/bookings`)
            .then((res) => res.json())
            .then((data) => setBackendData(Array.isArray(data) ? data : []));
        })
        .catch((err) => console.error("Cancellation error:", err))
    }
    function checkIn(id) {
        setBackendData(prev =>
            prev.map(booking =>
                booking.id === id ? {...booking, checkedIn: true} : booking
            )
        );
    }

    const upcoming = backendData.filter((b) => b.status === "confirmed" && b.date >= todayKey)
    const past = backendData.filter((b) => b.status !== "confirmed"|| b.date < todayKey)

    let list = upcoming 
    if (activeTab === "past") {
        list = past
    }
    let upcomingTab = "border-b-2 border-transparent px-4 py-2 text-gray-600 md:text-base"
    let pastTab = "border-b-2 border-transparent px-4 py-2 text-sm text-gray-600 md:text-base"
    if (activeTab === "upcoming") {
        upcomingTab = "border-b-2 border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 md:text-base"
    }
    if (activeTab === "past") {
        pastTab = "border-b-2 border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 md:text-base"
    }
    return (
        <div>
            <div className="mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-bold md:text-2xl">My Bookings</h2>
                    <p className="text-sm text-gray-600 md:text-base">
                        Manage your upcoming and past desk and room bookings.
                    </p>
                </div>
                <Link 
                to="/new-booking"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 md:py-3">
                    <Plus className="h-5 w-5" />
                    New Booking
                </Link>
            </div>

            <div className="mb-4 flex border-b md:mb-6">
                <button onClick={() => setActiveTab("upcoming")} className={upcomingTab}>
                    Upcoming
                </button>
                <button onClick={() => setActiveTab("past")} className={pastTab}>
                    Past
                </button>
            </div>
            {list.length === 0 && (
                <p className="rounded-2xl border bg-white p-4 text-gray-500 md:p-5">
                    No bookings here yet.
                </p>
            )}

            <div className="flex flex-col gap-3 md:gap-4">
                {list.map((b) => {
                    const isCancelled = b.string === "cancelled"
                    const isPastDate = b.date < todayKey
                    const disabled = isCancelled || isPastDate

                    let typeBadge = "rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                    let iconBox = "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 md:h-16 md:w-16"
                    if (b.type === "room") {
                        typeBadge = "rounded-md bg-purple-50 px-2 py-0.5 text-xs text-purple-700"
                        iconBox = "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 md:h-16 md:w-16"
                    }
                    // Confirmed = green, Cancelled = red
                    let statusClass= "flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 md:text-sm"
                    let statusText = "Confirmed"
                    if (isCancelled) {
                        statusClass = "flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-green-700 md:text-sm"
                        statusText = "Cancelled"
                    }
                    let cancelClass = "flex items-center justify-center gap-1 rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50"
                    let checkClass = "flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    if (disabled) {
                        cancelClass="flex items-center justify-center gap-1 rounded-lg border bg-white px-3 py-2 text-sm text-gray-300"
                        checkClass="flex items-center justify-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-400"
                }

                return (
                    <div key={b.id} className="flex flex-col gap-3 rounded-2xl border bg-white p-3 md:flex-row md:justify-between md:p-5">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className={iconBox}>
                                {b.type === "desk" ? <Monitor /> : <DoorOpen />}
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-base font-semibold md:text-lg">{b.resource}</h3>
                                    <span className={typeBadge}>
                                        {b.type === "desk" ? "Desk" : "Room"}
                                    </span>
                                </div>
                                <div className="mt-1 flex flex-col gap-1 text-xs text-gray-600 md:flex-row md:gap-4 md:text-sm">
                                    <p className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 shrink-0" />{b.dateText}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 shrink-0" />{b.startTime} - {b.endTime}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 md:items-end">
                            <span className={statusClass}>
                                {isCancelled ? (
                                    <XCircle className="h-4 w-4" />
                                ) : (
                                    <CheckCircle className="h-4 w-4" />
                                )}
                                {statusText}
                            </span>
                            <div className="flex gap-2">
                                <button disabled={disabled} onClick={() => cancelBooking(b.id)}
                                className={cancelClass}>
                                    <X className="h-4 w-4" /> Cancel
                                </button>
                                <button disabled={disabled || b.checkedIn === true} onClick={() => checkIn(b.id)} className={checkClass}>
                                    <Check className="h-4 w-4" />
                                    {b.checkedIn === true ? "Checked in" : "Check-in"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
                })}
            </div>
        </div>
    )
}

export default MyBookingsPage