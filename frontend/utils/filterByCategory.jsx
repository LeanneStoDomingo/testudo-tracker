const filterByCategory = (category, data) => data.filter((item) => item.link.includes(`/${category}/`))

export default filterByCategory