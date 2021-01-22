import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SearchContext from '../utils/SearchContext'
import NotFound from './NotFound'
import CourseDetail from '../components/CourseDetail'

const CoursePage = () => {
    const values = useContext(SearchContext)
    const location = useLocation()
    const [item, setItem] = useState(null)

    useEffect(() => {
        setItem(values ? values.find(elt => {
            return elt.link === location.pathname
        }) : null)
    }, [values, location.pathname])

    return (item ?
        < CourseDetail id={item.id} code={item.code} name={item.name} />
        : <NotFound />
    )
}

export default CoursePage
