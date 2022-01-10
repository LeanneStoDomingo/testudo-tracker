import CourseResults from "@components/search/CourseResults"
import useGened from "@utils/api/useGened"

const Gened = () => {
    // const router = useRouter()
    // const { courses } = useGened(router.query.code)
    const { courses } = useGened(1)

    const results = courses?.map(({ code, name }) => ({
        code,
        name,
        link: `/courses/${code}`,
        text: `${code} ${name}`
    }))

    return <CourseResults title='code' results={results} />
}

export default Gened
