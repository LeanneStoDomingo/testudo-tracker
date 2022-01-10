import SearchResults from "@components/search/SearchResults"
import useDepartment from "@utils/api/useDepartment"
import { useRouter } from "next/router"

const Department = () => {
    const router = useRouter()
    // const { courses } = useDepartment(router.query.code)
    const { courses } = useDepartment(1)

    const results = courses?.map(({ code, name }) => ({
        code,
        name,
        link: `/courses/${code}`,
        text: `${code} ${name}`
    }))

    return (
        <>
            <section>
                <h1>code</h1>
                <div>chart</div>
            </section>
            <section>
                <SearchResults titleTag='h2' search={results} />
            </section>
        </>
    )
}

export default Department
