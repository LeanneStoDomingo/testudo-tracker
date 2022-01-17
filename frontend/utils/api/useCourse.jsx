import useSWR from '@utils/useSWR'

const useCourse = (code, fallbackData) => useSWR(`/courses/${code}`, fallbackData)

export default useCourse
