import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout() {
    const [ open, setOpen ] = useState(false)

    function toggleSidebar() {
        setOpen(! open)
    }
    function closeOnPhone() {
        if (window.innerWidth < 768 ) {
            setOpen(false)
        }
    }

    return(

        <div className='flex h-screen'>
          {open && (
            <div onClick={toggleSidebar} className='fixed inset-0 z-10 bg-black/40 md:hidden'>
                </div>
          )}

          {open && <Sidebar onNavigate={closeOnPhone} />}
          <div className='flex min w-0 flex-1 flex-col overflow-hidden'>
            <Header onToggle={toggleSidebar} />
            <main className='flex-1 overflow-y-auto bg-slate-50 p-4 pb-10 md:p-8 md:pb-10'>
                <Outlet />
            </main>
          </div>
        </div>
    )
}

export default Layout