import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarPlus, CalendarCheck } from "lucide-react";

function Sidebar(props) {
    // NavLink gives us "isActive" so we can highlight the current page


function getLinkClass(info) {
    if (info.isActive) {
        return "flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-blue-600"
    }
    return "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50"
}

return (
    <aside className="fixed inset-y-0 left-0 z-20 h-screen w-56 shrink-0 border-r bg-white p-3 md:static md:z-auto md:w-64 md:p-4">
        <h2 className="mb-6 px-3 text-2xl font-bold text-blue-600 md:mb-8 md:text-2xl">OfficeBooking</h2>

        <nav className="flex flex-col gap-2">
            <NavLink to="/" end className={getLinkClass} onClick={props.onNavigate}>
            <LayoutDashboard className="h-5 w-5" />
             Dashboard 
            </NavLink>

            <NavLink to="/new-booking" className={getLinkClass} onClick={props.onNavigate}>
            <CalendarPlus className="h-5 w-5" />
             New Booking
            </NavLink>

            <NavLink to="/my-bookings" className={getLinkClass} onClick={props.onNavigate}>
            <CalendarCheck className="h-5 w-5" />
             My Bookings
            </NavLink>
        </nav>
    </aside>
)
}

export default Sidebar