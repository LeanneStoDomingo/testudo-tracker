import CourseResults from "@components/search/CourseResults"
import useProfessor from "@utils/api/useProfessor"

const Professor = () => {
    // const router = useRouter()
    // const { courses } = useProfessor(router.query.slug)
    const { courses } = useProfessor(1)

    const results = courses?.map(({ code, name }) => ({
        code,
        name,
        link: `/courses/${code}`,
        text: `${code} ${name}`
    }))

    return <CourseResults title='code' results={results} />
}

export default Professor
