import Link from "next/link"

const Card = ({ code, name, link }) => {
    return (
        <Link href={link}>
            <a>
                <span>{code}</span>
                <span>{name}</span>
            </a>
        </Link>
    )
}

export default Card
