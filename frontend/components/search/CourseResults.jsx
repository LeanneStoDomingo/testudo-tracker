import Chart from "@components/Chart"
import SearchResults from "@components/search/SearchResults"

const CourseResults = ({ title, results, seats }) => {
    return (
        <>
            <section>
                <h1>{title}</h1>
                <Chart seats={seats} />
            </section>
            <section>
                <SearchResults titleTag='h2' search={results} />
            </section>
        </>
    )
}

export default CourseResults
