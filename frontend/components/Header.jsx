import useHeader from "@utils/useHeader"
import Link from "next/link"

const Header = () => {
    const { state, openMenu, toggleDropdown, openSearch, close } = useHeader()

    return (
        <header>
            <h1><Link href='/'><a>Testudo Tracker</a></Link></h1>
            <nav className={`${state.menuOpen} lg:block`}>
                <ul>
                    <li><Link href='/'><a>Home</a></Link></li>
                    <li>
                        <div onClick={toggleDropdown}>Courses</div>
                        <ul className={`${state.dropdownOpen}`}>
                            <li><Link href='/departments'><a>By Department</a></Link></li>
                            <li><Link href='/professors'><a>By Professor</a></Link></li>
                            <li><Link href='/geneds'><a>By GenEd</a></Link></li>
                        </ul>
                    </li>
                    <li><Link href='/about'><a>About</a></Link></li>
                </ul>
            </nav>
            <div>
                <div onClick={openSearch}>Search Icon</div>
                <div className={`${state.searchOpen} lg:block`}>Search Bar</div>
                {state.open
                    ? <div onClick={close}>Close Icon</div>
                    : <div onClick={openMenu}>Menu Icon</div>
                }
            </div>
        </header>
    )
}

export default Header
