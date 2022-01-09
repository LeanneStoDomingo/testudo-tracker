import SearchSection from "@components/SearchSection"

const CategorySection = ({ title, results }) => {
    return (
        <>
            <section>
                <h1>{title}</h1>
                <div>chart</div>
            </section>
            <section>
                <SearchSection titleTag='h2' results={results} />
            </section>
        </>
    )
}

export default CategorySection
