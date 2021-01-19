import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SearchContext from '../utils/SearchContext'
import NotFound from './NotFound'

const CourseDetail = () => {
    const values = useContext(SearchContext)
    const location = useLocation()
    const [item, setItem] = useState({})

    useEffect(() => {
        setItem(values ? values.find(elt => {
            return elt.link === location.pathname
        }) : null)
        console.log(item)
    }, [values])

    return (item ?
        <div>
            Individual Course Goes Here: {location.pathname}
        </div> : <NotFound />
    )
}

export default CourseDetail
