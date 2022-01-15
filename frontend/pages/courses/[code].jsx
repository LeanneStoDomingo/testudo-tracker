import Chart from "@components/Chart"
import axios from "@utils/axios"
import formatChartData from "@utils/formatChartData"
import { useRouter } from "next/router"

const Course = ({ name, data }) => {
    const router = useRouter()
    const { code } = router.query

    return (
        <>
            <h1>{code}</h1>
            <p>{name}</p>
            <Chart data={data} />
        </>
    )
}

export default Course

export const getStaticPaths = async () => {
    const { data } = await axios.get('/search')
    const courses = data.data.filter((item) => item.link.includes('/courses/'))

    // const paths = courses.map((course) => ({ params: { code: course.code } }))
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
            name,
            data: formatChartData(seats)
        }
    }
}
