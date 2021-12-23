import '@styles/globals.css'
import Head from 'next/head'

const App = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default App
