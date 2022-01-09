import ChevronDownIcon from "@icons/ChevronDownIcon"
import CloseIcon from "@icons/CloseIcon"
import MenuIcon from "@icons/MenuIcon"
import SearchIcon from "@icons/SearchIcon"
import useSearch from "@utils/useSearch"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useReducer, useState } from "react"

const initialState = {
    nav: false,
    courses: false,
    search: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'navIcon':
            return {
                nav: !state.nav,
                courses: false,
                search: false
            }
        case 'courses':
            return {
                nav: true,
                courses: !state.courses,
                search: false
            }
        case 'search':
            return {
                nav: false,
                courses: false,
                search: !state.search
            }
        case 'navItem':
        case 'courseItem':
        case 'searchSubmit':
        case 'close':
        default:
            return initialState
    }
}

const Header = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const router = useRouter()
    const [query, setQuery] = useState('')
    const { search, loading, error } = useSearch()

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch({ type: 'searchSubmit' })

        const filtered = search.filter((item) => item.text.toLowerCase().includes(query.toLowerCase()))
        setQuery('')

        if (filtered.length === 1) {
            router.push(filtered[0].link)
        } else {
            router.push(`/search?query=${query}`)
        }
    }

    useEffect(() => {
        dispatch({ type: 'close' })
    }, [router.asPath])

    return (
        <header className={`fixed bg-primary-500 z-40 w-screen p-3`}>
            <div className="container flex mx-auto">
                <Link href='/'><a className='text-lg' onClick={() => dispatch({ type: 'navItem' })}>Testudo Tracker</a></Link>
                <nav className={`absolute bg-primary-500 w-screen left-0 top-9 py-3 shadow-lg text-center ${state.nav ? '' : 'hidden'}`}>
                    <ul>
                        <li onClick={() => dispatch({ type: 'navItem' })}><Link href='/'>Home</Link></li>
                        <li>
                            <div onClick={() => dispatch({ type: 'courses' })} className='flex justify-center'>
                                <div className="ml-5 ">Courses</div>
                                <ChevronDownIcon />
                            </div>
                            {state.courses &&
                                <ul className="flex flex-col bg-primary-600 rounded-md mx-4">
                                    <li onClick={() => dispatch({ type: 'courseItem' })}><Link href='/departments'>By Department</Link></li>
                                    <li onClick={() => dispatch({ type: 'courseItem' })}><Link href='/professors'>By Professor</Link></li>
                                    <li onClick={() => dispatch({ type: 'courseItem' })}><Link href='/geneds'>By GenEd</Link></li>
                                </ul>
                            }
                        </li>
                        <li onClick={() => dispatch({ type: 'navItem' })}><Link href='/about'>About</Link></li>
                    </ul>
                </nav>
                <div className='ml-auto flex gap-2 items-center'>
                    <SearchIcon onClick={() => dispatch({ type: 'search' })} />
                    <div onClick={() => dispatch({ type: 'navIcon' })} className="w-7">
                        {state.nav ? <CloseIcon /> : <MenuIcon />}
                    </div>
                </div>
                {state.search &&
                    <div className='absolute bg-primary-500 w-screen left-0 top-9 py-3'>
                        <form onSubmit={onSubmit} className="relative text-center mx-2">
                            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} className="container rounded p-2 text-black focus:outline-none peer" placeholder="Search" type="text" />
                            <div className='hidden peer-focus:block left-0 absolute bg-white text-black shadow-lg rounded mt-1 w-full wrap text-base md:text-xl text-left'>
                                <ul>
                                    {query.length != 0 && !error && !loading &&
                                        search
                                            .filter((item) => item.text.toLowerCase().includes(query.toLowerCase()))
                                            .slice(0, 10)
                                            .map((item, index) => <li key={index} className='rounded p-2 hover:bg-primary-50 cursor-pointer'><Link href={item.link}>{item.text}</Link></li>)}
                                </ul>
                            </div>
                        </form>
                    </div>
                }

            </div>
        </header>
    )
}

export default Header
