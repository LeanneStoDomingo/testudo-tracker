import CourseResults from "@components/search/CourseResults"
import useDepartment from "@utils/api/useDepartment"
// import { useRouter } from "next/router"

const Department = () => {
    // const router = useRouter()
    // const { courses } = useDepartment(router.query.code)
    const { courses } = useDepartment(1)

    const results = courses?.map(({ code, name }) => ({
        code,
        name,
        link: `/courses/${code}`,
        text: `${code} ${name}`
    }))

    return <CourseResults title='code' results={results} />
}

export default Department
