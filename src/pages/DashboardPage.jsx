import { useState} from 'react'
import { Link } from 'react-router-dom'
import { Monitor, DoorOpen, Users, Calendar, MapPin, Clock, Plus } from 'lucide-react'
import { bookings, stats } from "../data/mockData"

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
        <div className='flex items-center gap-3 rounded-2xl border bg-white p-4 md:p-5'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 md:h-14 md:w-14'>
                {props.icon}
            </div>
            <div>
                <p className='text-sm text-gray-600 md:text-sm'>{props.label}</p>
                <p className='text-2xl font-bold md:text-3xl'>{props.value}</p>
                <p className='text-sm text-green-600 md:text-sm'>{props.note}</p>
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
    const upcoming = bookings
    .filter((b) => b.date >= todayKey)
    .slice(0, 2)

    return (
        <div>
            <p className='mb-4 text-sm text-gray-600 md:text-base'>
                Here's what's happening in the office today.
            </p>

            {/* Stat cards */}
            <div className='grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4'>
                <StatCard
                icon={<Monitor />}
                label='Desks booked today'
                value={stats.deskBooked}
                note={stats.desksAvailable + "available"} />

                <StatCard
                icon={<DoorOpen />}
                label='Meeting rooms in use'
                value={stats.roomsInUse}
                note={stats.peopleChange + "% vs yesterday"} />

                <StatCard
                icon={<Users />}
                label='People in office'
                value={stats.peopleInOffice}
                note={stats.peopleChange + "% vs yesterday"} />
            </div>

            {/* Bookings and Calendar */}
            <div className='mt-6 grid grid-cols-1 gap-6 md:mt-8 lg:grid-cols-3'>
                <section className='lg:col-span-2'>
                    <h2 className='mb-3 text-base font-semibold md:mb-4 md:text-lg'>Your upcoming bookings</h2>

                    {upcoming.length === 0 && (
                        <p className='text-gray-500'>No upcoming bookings yet.</p>
                    )}

                    <div className='flex flex-col gap-3 md:gap-4'>
                        {upcoming.map((b) =>(
                            <div key={b.id} className='flex gap-3 rounded-2xl border bg-white p-3  md:p-4'>
                                <div className='flex h-12 w-12 shrink-0 items-center justfify-center rounded-xl bg-blue-50 text-blue-600 md:h-16 md:w-16'>
                                    {b.type === "desk" ? <Monitor /> : <DoorOpen />}
                                </div>

                    <div className='min-w-0'>
                        <div className='flex flex-wrap items-center gap-2'>
                            <h3 className='text-base font-semibold'>{b.resource}</h3>
                            <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700'>
                                Confirmed
                            </span>
                        </div>

                        <p className='flex items-center gap-2 text-xs text-gray-600 md:text-sm'>
                            <Calendar className='h-4 w-4 shrink-0' /> {b.dateText}
                        </p>
                        <p className='flex items-center gap-2 text-xs text-gray-600 md:text-sm'>
                            <MapPin className='h-4 w-4' /> {b.location}
                        </p>
                        <p className='flex items-center gap-2 text-xs text-gray-600 md:text-sm'>
                            <Clock className='h-4 w-4' /> {b.startTime} - {b.endTime}
                        </p>
                        </div>
                    </div>
                        ))}
                    </div>
                </section>

                <aside className='flex flex-col gap-4'>
                    <MiniCalendar />
                    <Link to="/new-booking" className='flex items-center justfity-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700'>
                    <Plus className='h-5 w-5' />
                    Quick Book
                    </Link>
                    <p className='text-center text-sm text-gray-500'>
                        Book a desk or room in seconds
                    </p>
                </aside>
            </div>
        </div>
    )
}

export default DashboardPage