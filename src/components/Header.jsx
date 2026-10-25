import { Menu, Bell, User } from 'lucide-react'

function Header(props) {
    const now = new Date()
    const hour = now.getHours()

    let greeting = 'Good evening'
    if (hour < 12) greeting = 'Good morning'
    else if (hour < 18) greeting = 'Good afternoon'

    const today = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })

    return(
        <header className='flex items-center justify-between border-b bg-white px-4 py-3 md:px-8 md:py-4'>
            <div className='flex min-w-0 items-center gap-2 md:gap-4'>
                <button onClick={props.onToggle} className='shrink-0 rounded-lg p-2 hover:bg-gray-100'>
                    <Menu />
                </button>
                <div className='min-w-0'>
                    <h1 className='truncate text-lg font-bold md:text-2xl'>
                        {greeting}
                    </h1>
                    <p className='truncate text-xs text-gray-500 md:text-sm'>
                        <span className='hidden sm:inline'>Today is </span>
                        {today}
                    </p>
                </div>
            </div>

            <div className='flex shrink-0 items-center gap-2 md:gap-4'>
                <button className='rounded-lg p-2 hover:bg-gray-100'>
                    <Bell className='h-5 w-5 text-gray-600' />
                </button>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 md:h-10 md:w-10'>
                    <User className='h-5 w-5' />
                </div>
            </div>
        </header>
    )
}

export default Header