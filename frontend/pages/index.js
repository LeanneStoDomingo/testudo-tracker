import Head from 'next/head'

const Home = () => {
    return (
        <>
            <Head>
                <title>Testudo Tracker</title>
                <meta name='description' content='A student run website that tracks seat availability for courses at the University of Maryland, College Park' />
            </Head>
            <div className='flex flex-col text-center'>
                <h1 className='text-6xl font-semibold'>Testudo Tracker</h1>
                <p className='text-xl'>A student run website that tracks seat availability for courses at the University of Maryland, College Park</p>
                <div className='flex justify-center gap-3 mx-2 my-5 text-xl'>
                    <input className='w-3/4 max-w-2xl rounded p-3 text-black focus:outline-none focus:ring focus:ring-primary-700 focus:ring-offset-4 focus:ring-offset-primary-500' placeholder='Search for Courses, Professors, Departments, GenEds, etc...' />
                    <button className='bg-primary-700 rounded py-3 px-4 focus:outline-none focus:ring focus:ring-primary-700 focus:ring-offset-4 focus:ring-offset-primary-500'>Search</button>
                </div>
            </div>
            <div className='bg-white text-black'>
                <h2 className='text-3xl text-center'>Popular Courses</h2>
                <div className='grid grid-cols-1 xl:grid-cols-3 gap-2'>
                    <div className='w-96 h-80 bg-gray-300'>chart</div>
                    <div className='w-96 h-80 bg-gray-300'>chart</div>
                    <div className='w-96 h-80 bg-gray-300'>chart</div>
                </div>
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-2'>
                <div className='w-96 h-80 bg-gray-300 text-black'>chart</div>
                <div className='w-96 h-80 bg-gray-300 text-black'>chart</div>
            </div>
        </>
    )
}

export default Home