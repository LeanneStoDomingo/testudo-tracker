import Chart from "@components/Chart"
// import useCourse from "@utils/api/useCourse"
import axios from "@utils/axios"
import filterByCategory from "@utils/filterByCategory"
import formatChartData from "@utils/formatChartData"
import useSWR from "@utils/useSWR"
import { useRouter } from "next/router"
// import useSWR from "swr"


const Course = ({ fallbackData }) => {
    const router = useRouter()
    const { code } = router.query

    // const { name, seats } = useCourse(code, fallbackData)
    const { name, seats } = useSWR(`/courses/${code}`, fallbackData)

    return (
        <>
            <h1>{code}</h1>
            <p>{name}</p>
            <Chart data={formatChartData(seats)} />
        </>
    )
}

export default Course

export const getStaticPaths = async () => {
    // add `/courses` endpoint to api (won't need filterByCategory)
    // const { data } = await axios.get('/courses')
    const { data } = await axios.get('/search')
    const courses = filterByCategory('courses', data.data)

    // change api to accept code instead of id
    // const paths = data.courses.map((course) => ({ params: { code: course.code } }))
    const paths = courses.map((course) => ({ params: { code: course.id.toString() } }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: { code } }) => {
    const { data: { name, seats } } = await axios.get(`/courses/${code}`)

    return {
        props: {
            fallbackData: { name, seats }
        }
    }
}
