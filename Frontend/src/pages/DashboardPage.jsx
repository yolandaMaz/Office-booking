import { useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Monitor, DoorOpen, Users, Calendar, MapPin, Clock, Plus } from 'lucide-react'
import { bookings} from "../data/mockData"

function getDateKey(year, month, day) {
    let m = month + 1
    let d = day
    if (m < 10) m = "0" + m
    if (d < 10) d = "0" + d
    return year + "-" + m + "-" + d
}

const today = new Date()
const todayKey = getDateKey(today.getFullYear(), today.getMonth(), today.getDate())

function StatCard(props) {
    return (
        <div className={`flex items-center gap-3 rounded-2xl p-4 shadow-sm md:p-5 ${props.className}`}>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white-80  md:h-14 md:w-14'>
                {props.icon}
            </div>
            <div>
                <p className='text-xs text-gray-600 sm:text-sm'>{props.label}</p>
                <p className='text-xl font-bold sm:text-2xl md:text-3xl'>{props.value}</p>
                <p className='text-xs text-gray-500 md:text-sm'>{props.note}</p>
            </div>
        </div>
    )
}

function MiniCalendar() {
    const [ currentDate, setCurrentDate ] = useState(new Date())

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDate()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthName = currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    })

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

    return (
        <div className='rounded-2xl border bg-white p-4 md:p-5'>
            <div className='mb-2 flex items-center justify-between md:mb-4'>
                <h3 className='font-semibold text-sm md:text-base'>{monthName}</h3>
                <div className='flex gap-1 md:gap-2'>
                    <button onClick={previousMonth} className='px-2 hover:bg-gray-100'>
                        &lt;
                    </button>
                    <button onClick={nextMonth} className='px-2 hover:bg-gray-100'>
                        &gt;
                    </button>
                </div>
            </div>
            
            <div className='grid grid-cols-7 text-center text-[10px] text-gray-500 md:text-xs'>
                <div className='py-2'>SUN</div>
                <div className='py-2'>MON</div>
                <div className='py-2'>TUE</div>
                <div className='py-2'>WED</div>
                <div className='py-2'>THU</div>
                <div className='py-2'>FRI</div>
                <div className='py-2'>SAT</div>
            </div>

            <div className='grid grid-cols-7 text-center text-sm md:text-sm'>
                {cells.map((day, index) => {
                    if (day === null) {
                        return <div key={index}></div>
                    }
                    const key = getDateKey(year, month, day)
                    const isToday = key === todayKey
                    const hasBooking = bookings.some((b) => b.date === key)

                    let dayClass = 'flex h-6 w-6 items-center justify-center text-gray-800 md:h-8 md:w-8'
                    if (isToday) {
                        dayClass = 'flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white md:h-8 md:w-8'
                    }

                    return (
                        <div key={index} className='flex flex-col items-center py-0.5 md:py-1'>
                           <div className={dayClass}>{day}</div>
                           {hasBooking && <span className='h-1 w-1 rounded-full bg-blue-600'></span>}
                           </div>
                    )
                })}
            </div>
        </div>
    )
}

function DashboardPage() {
    const [ backendData, setBackendData ] = useState([]);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL;

        fetch(`${API_URL}/api/bookings`)
        .then((res) => res.json())
        .then((data) => {
            console.log("Connected! Backend data:", data);
            setBackendData(data);
        })
        .catch((err) => console.error("API Error", err));
    }, [])
    const upcoming = backendData
    .filter((b) => b.status === "confirmed" && b.date >= todayKey)
    .slice(0, 2)

    return (
        <div>
            <p className='mb-4 text-sm text-gray-600 md:text-base'>
                Here's what's happening in the office today.
            </p>

            {/* Stat cards */}
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4'>
                <StatCard
                className="bg-blue-100"
                icon={<Monitor />}
                label='Desks booked today'
                value={backendData.filter(b => b.status === "confirmed" && b.resource === "desk").length}
                 />

                <StatCard
                className="bg-purple-100"
                icon={<DoorOpen />}
                label='Meeting rooms in use'
                value={backendData.filter(b => b.status === "confirmed" && b.resource === "room").length}
                />

                <StatCard
                className="bg-green-100"
                icon={<Users />}
                label='People in office'
                value={backendData.filter(b => b.status === "confirmed").length}
                />
            </div>

            {/* Bookings and Calendar */}
           <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3'>

            {/* Upcoming Bookings*/}
            <section className='lg:col-span-2'>
                <h2 className='mb-4 text-lg font-semibold text-gray-800'>
                    Your upcoming bookings
                </h2>
                {upcoming.length === 0 ? (
                    <p className='text-gray-500'>No upcoming bookings yet.</p>
                ) : (
                    <div className='flex flex-col gap-4'>
                        {upcoming.map((b) => (
                            <div
                            key={b.id}
                            className={`flex gap-4 rounded-2xl p-4 shadow-sm ${b.type === "desk" ? "bg-blue-100" : "bg-purple-100"}`}>
                    <div 
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl 
                        ${b.type === "desk" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}
                        >
                    
                        {b.type === "desk" ? <Monitor size={22} /> : <DoorOpen size={22} />} 
                        </div>

                        <div className='min-w-0 flex-1'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <h3 className='font-semibold text-gray-800'>{b.resource}</h3>
                                <span className='rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700'>
                                    Confirmed
                                </span>
                            </div>
                            <div className='mt-1 space-y-1 text-sm text-gray-600'>
                                <p className='flex items-center gap-1.5'>
                                    <Calendar size={14} /> {b.dateText}
                                </p>
                                <p className='flex items-center gap-1.5'>
                                    <MapPin size={14} /> {b.location}
                                </p>
                                <p className='flex items-center gap-1.5'>
                                    <Clock size={14} /> {b.startTime} - {b.endTime}
                                </p>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Calendar + Quick Book */}
            <aside className='flex flex-col gap-4'>
                <div className='rounded-2xl bg-purple-80 p-4 shadow-purple'>
                    <MiniCalendar />
                </div>
                <Link 
                to="/new-booking"
                className='flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700'>
                    <Plus size={18} />
                    Quick Book
                </Link>
            </aside>
            </div>
           </div>
    )
}

export default DashboardPage