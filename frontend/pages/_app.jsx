import '@styles/globals.css'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import fetcher from '@utils/fecther'
import Header from '@components/Header'
import Footer from '@components/Footer'

const App = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>Testudo Tracker</title>
                <meta name='description' content='A student run website that tracks seat availability for courses at the University of Maryland, College Park' />
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            <SWRConfig value={{ fetcher }}>
                <Header />
                <main>
                    <Component {...pageProps} />
                </main>
                <Footer />
            </SWRConfig>
        </>
    )
}

export default App
