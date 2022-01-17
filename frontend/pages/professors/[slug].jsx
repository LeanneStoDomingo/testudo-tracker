import CourseResults from "@components/search/CourseResults"
import useProfessor from "@utils/api/useProfessor"
import axios from "@utils/axios"
import filterByCategory from "@utils/filterByCategory"
import formatChartData from "@utils/formatChartData"
import { useRouter } from "next/router"

const Professor = ({ fallbackData }) => {
    const router = useRouter()
    const { slug } = router.query

    const { name, seats, courses } = useProfessor(slug, fallbackData)

    // temp solution until api endpoint includes link and text
    const results = courses.map(({ code, name }) => ({
        code,
        name,
        link: `/courses/${code}`,
        text: `${code} ${name}`
    }))

    return <CourseResults title={name} results={results} chartData={formatChartData(seats)} />
}

export default Professor

export const getStaticPaths = async () => {
    // add `/professors` endpoint to api (won't need filterByCategory)
    // const { data } = await axios.get('/professors')
    const { data } = await axios.get('/search')
    const professors = filterByCategory('professors', data.data)

    // const paths = data.professors.map((professor) => ({ params: { slug: professor.slug } }))
    const paths = professors.map((professor) => ({ params: { slug: professor.id.toString() } }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: { slug } }) => {
    const { data: { name, seats, courses } } = await axios.get(`/professors/${slug}`)

    return {
        props: {
            fallbackData: { name, seats, courses }
        }
    }
}
