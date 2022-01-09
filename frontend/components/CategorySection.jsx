import SearchSection from "@components/SearchSection"

const CategorySection = ({ title }) => {
    return (
        <>
            <section>
                <h1>{title}</h1>
                <div>chart</div>
            </section>
            <section>
                <SearchSection h2={true} />
            </section>
        </>
    )
}

export default CategorySection
