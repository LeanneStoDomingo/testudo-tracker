import SearchResults from "@components/search/SearchResults"

const CourseResults = ({ title, results }) => {
    return (
        <>
            <section>
                <h1>{title}</h1>
                <div>chart</div>
            </section>
            <section>
                <SearchResults titleTag='h2' search={results} />
            </section>
        </>
    )
}

export default CourseResults
