import CourseResults from "@components/search/CourseResults"
import axios from "@utils/axios"
import filterByCategory from "@utils/filterByCategory"
import useSWR from "@utils/useSWR"
import { useRouter } from "next/router"

const Gened = ({ fallbackData }) => {
    const router = useRouter()
    const { code } = router.query

    const { name, seats, courses } = useSWR(`/geneds/${code}`, fallbackData)

    // temp solution until api endpoint includes link and text
    const results = courses.map(({ code, name }) => ({
        code,
        name,
        link: `/courses/${code}`,
        text: `${code} ${name}`
    }))

    return <CourseResults title={`${code}: ${name}`} results={results} seats={seats} />
}

export default Gened

export const getStaticPaths = async () => {
    // add `/geneds` endpoint to api (won't need filterByCategory)
    // const { data } = await axios.get('/geneds')
    const { data } = await axios.get('/search')
    const geneds = filterByCategory('geneds', data.data)

    // const paths = data.geneds.map((gened) => ({ params: { code: gened.code } }))
    const paths = geneds.map((gened) => ({ params: { code: gened.id.toString() } }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: { code } }) => {
    const { data: { name, seats, courses } } = await axios.get(`/geneds/${code}`)

    return {
        props: {
            fallbackData: { name, seats, courses }
        }
    }
}
