import CourseResults from "@components/search/CourseResults"
import axios from "@utils/axios"
import filterByCategory from "@utils/filterByCategory"
import useSWR from "@utils/useSWR"
import { useRouter } from "next/router"

const Department = ({ fallbackData }) => {
    const router = useRouter()
    const { code } = router.query

    const { name, seats, courses } = useSWR(`/departments/${code}`, fallbackData)

    // temp solution until api endpoint includes link and text
    const results = courses.map(({ code, name }) => ({
        code,
        name,
        link: `/courses/${code}`,
        text: `${code} ${name}`
    }))

    return <CourseResults title={`${code}: ${name}`} results={results} seats={seats} />
}

export default Department

export const getStaticPaths = async () => {
    // add `/departments` endpoint to api (won't need filterByCategory)
    // const { data } = await axios.get('/departments')
    const { data } = await axios.get('/search')
    const departments = filterByCategory('departments', data.data)

    // const paths = data.departments.map((department) => ({ params: { code: department.code } }))
    const paths = departments.map((department) => ({ params: { code: department.id.toString() } }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async ({ params: { code } }) => {
    const { data: { name, seats, courses } } = await axios.get(`/departments/${code}`)

    return {
        props: {
            fallbackData: { name, seats, courses }
        }
    }
}
