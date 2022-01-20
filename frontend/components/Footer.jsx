import Link from "next/link"

const Footer = () => {
    return (
        <footer>
            <Link href='/'><a>Testudo Tracker</a></Link>
            <Link href='/github'><a>GitHub</a></Link>
            <Link href='/reddit'><a>Reddit</a></Link>
        </footer>
    )
}

export default Footer
