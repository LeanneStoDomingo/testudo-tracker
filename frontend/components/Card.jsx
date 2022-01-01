import Link from "next/link"

const Card = ({ item, ...props }) => {
    return (
        <Link href={item.link} {...props} >
            <a className="shadow hover:shadow-lg cursor-pointer rounded">
                {item.code ?
                    <div className="bg-zinc-100 h-full rounded">
                        <div className="bg-zinc-300 text-lg rounded-t p-2">{item.code}</div>
                        <div className="m-2">{item.name}</div>
                    </div>
                    :
                    <div className="bg-zinc-300 p-2 h-full rounded">{item.name}</div>
                }
            </a>
        </Link>
    )
}

export default Card
