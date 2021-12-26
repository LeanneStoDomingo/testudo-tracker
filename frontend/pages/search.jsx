import useSearch from "@utils/useSearch"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

const Search = () => {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [showResults, setShowResults] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const { search, loading, error } = useSearch()

    const filtered = search?.filter((item) => item.text.toLowerCase().includes(query?.toLowerCase()))

    useEffect(() => {
        setQuery(router.query.query || '')
    }, [router.query.query])

    useEffect(() => {
        setShowResults(search?.filter((item) => item.text.toLowerCase().includes(query?.toLowerCase())).slice(0, 20))
    }, [search, query])


    const getMoreResults = () => setShowResults(results => {
        if (results.length + 20 >= filtered.length) setHasMore(false)
        return filtered.slice(0, results.length + 20)
    })

    const onSubmit = (e) => {
        e.preventDefault()

        if (filtered.length === 1) {
            router.push(filtered[0].link)
        } else {
            router.push(`/search?query=${query}`)
        }
    }

    return (
        <div className="bg-white text-black">
            <h1>Search</h1>
            <form className='flex justify-center gap-3 my-5 text-xl pb-10' onSubmit={onSubmit}>
                <div className='flex-col w-3/4 relative max-w-2xl'>
                    <input onChange={(e) => setQuery(e.target.value)} value={query} className='peer shadow-2xl w-full rounded p-3 text-black focus:outline-none focus:ring-4 focus:ring-primary-900/50' placeholder='Search for Courses, Professors, Departments, GenEds, etc...' />
                    <div className='hidden focus-within:block peer-focus:block absolute bg-white text-black shadow-lg rounded mt-1 w-full wrap text-base md:text-xl text-left'>
                        <ul>
                            {query?.length != 0 && !error && !loading &&
                                filtered
                                    .slice(0, 10)
                                    .map((item, index) => <li key={index} className='rounded p-2 hover:bg-primary-50 cursor-pointer'><Link href={item.link}>{item.text}</Link></li>)}
                        </ul>
                    </div>
                </div>
                <input className='shadow-2xl bg-primary-700 rounded py-3 px-4 focus:outline-none focus:ring-4 focus:ring-primary-900/[.70] hover:bg-primary-800 text-white' type='submit' value='Submit' />
            </form>
            <div>
                <InfiniteScroll
                    dataLength={showResults?.length || 0}
                    next={getMoreResults}
                    hasMore={hasMore}
                    loader={<div>Loading...</div>}
                    endMessage={<div>End of results</div>}
                >
                    {!error && !loading &&
                        showResults?.map((item, index) => (
                            <div key={index}>
                                <div className="bg-gray-500">{item.code}</div>
                                <div className="bg-gray-200">{item.name}</div>
                            </div>
                        ))
                    }
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default Search
