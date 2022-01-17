import useSWR from '@utils/useSWR'

const useProfessors = (fallbackData) => useSWR('/professors', fallbackData)

export default useProfessors
