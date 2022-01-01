import '@styles/globals.css'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import fetcher from '@utils/fecther'

const App = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>Testudo Tracker</title>
                <meta name='description' content='A student run website that tracks seat availability for courses at the University of Maryland, College Park' />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SWRConfig value={{ fetcher }}>
                <Component {...pageProps} />
            </SWRConfig>
        </>
    )
}

export default App
