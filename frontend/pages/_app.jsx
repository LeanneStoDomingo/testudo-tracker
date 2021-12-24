import '@styles/globals.css'
import Head from 'next/head'
import { SearchProvider } from '@utils/SearchContext'

const App = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SearchProvider>
                <Component {...pageProps} />
            </SearchProvider>
        </>
    )
}

export default App
