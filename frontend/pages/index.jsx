import useSearch from '@utils/useSearch'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Home = () => {
    const [query, setQuery] = useState('')
    const { search, loading, error } = useSearch()
    const router = useRouter()

    const onSubmit = (e) => {
        e.preventDefault()

        const filtered = search.filter((item) => item.text.toLowerCase().includes(query.toLowerCase()))

        if (filtered.length === 1) {
            router.push(filtered[0].link)
        } else {
            router.push(`/search?query=${query}`)
        }
    }

    return (
        <>
            <Head>
                <title>Testudo Tracker</title>
                <meta name='description' content='A student run website that tracks seat availability for courses at the University of Maryland, College Park' />
            </Head>
            <div className='flex flex-col text-center mx-2'>
                <h1 className='text-5xl sm:text-6xl font-semibold'>Testudo Tracker</h1>
                <p className='text-xl'>A student run website that tracks seat availability for courses at the University of Maryland, College Park</p>
                <form className='flex justify-center gap-3 my-5 text-xl' onSubmit={onSubmit}>
                    <div className='flex-col w-3/4 relative max-w-2xl'>
                        <input onChange={(e) => setQuery(e.target.value)} value={query} className='w-full rounded p-3 text-black focus:outline-none focus:ring-4 focus:ring-primary-900/50' placeholder='Search for Courses, Professors, Departments, GenEds, etc...' />
                        <div className='absolute bg-white text-black shadow-lg rounded mt-1 w-full wrap text-base md:text-xl text-left'>
                            <ul>
                                {query.length != 0 && !error && !loading &&
                                    search
                                        .filter((item) => item.text.toLowerCase().includes(query.toLowerCase()))
                                        .slice(0, 10)
                                        .map((item) => <li key={item.link} className='rounded p-2 hover:bg-primary-50 cursor-pointer'><Link href={item.link}>{item.text}</Link></li>)}
                            </ul>
                        </div>
                    </div>
                    <input className='bg-primary-700 rounded py-3 px-4 focus:outline-none focus:ring-4 focus:ring-primary-900/[.70] hover:bg-primary-800' type='submit' value='Submit' />
                </form>
            </div>
            <div className='bg-white text-black'>
                <h2 className='text-3xl text-center'>Popular Courses</h2>
                <div className='grid grid-cols-1 xl:grid-cols-3 gap-2'>
                    <div className='w-96 max-w-full h-80 bg-gray-300'>chart</div>
                    <div className='w-96 max-w-full h-80 bg-gray-300'>chart</div>
                    <div className='w-96 max-w-full h-80 bg-gray-300'>chart</div>
                </div>
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-2'>
                <div className='w-96 max-w-full h-80 bg-gray-300 text-black'>chart</div>
                <div className='w-96 max-w-full h-80 bg-gray-300 text-black'>chart</div>
            </div>
        </>
    )
}

export default Home