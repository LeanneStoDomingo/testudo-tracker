import CategorySection from "@components/CategorySection"

const Department = () => {
    // api call to get classes that are in this department
    // const results = useDepartment('code')
    // return <CategorySection title='title' search={search} />
    return <CategorySection title='title' />
}

export default Department

// const CategorySection = ({ search }) => {
//     return (
//         <>
//             title
//             chart
//             <SearchSection results={search} />
//         </>
//     )
// }

// const SearchSection = ({ results }) => {
//     return (
//         <>
//             search title
//             <SearchBar results={results} />
//             {results.map()}
//         </>
//     )
// }