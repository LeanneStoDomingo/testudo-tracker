import useSWR from '@utils/useSWR'

const useDepartments = (fallbackData) => useSWR('/departments', fallbackData)

export default useDepartments
