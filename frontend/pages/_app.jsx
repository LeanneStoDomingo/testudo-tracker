import '@styles/globals.css'
import Head from 'next/head'
import { SWRConfig } from 'swr'
import fetcher from '@utils/fecther'

const App = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SWRConfig value={{ fetcher }}>
                <Component {...pageProps} />
            </SWRConfig>
        </>
    )
}

export default App
