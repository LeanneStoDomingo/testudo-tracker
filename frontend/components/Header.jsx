import Link from "next/link"

const Header = () => {
    return (
        <header>
            <h1><Link href='/'><a>Testudo Tracker</a></Link></h1>
            <nav>
                <ul>
                    <li><Link href='/'><a>Home</a></Link></li>
                    <li>
                        Courses
                        <ul>
                            <li><Link href='/departments'><a>By Department</a></Link></li>
                            <li><Link href='/professors'><a>By Professor</a></Link></li>
                            <li><Link href='/geneds'><a>By GenEd</a></Link></li>
                        </ul>
                    </li>
                    <li><Link href='/about'><a>About</a></Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
