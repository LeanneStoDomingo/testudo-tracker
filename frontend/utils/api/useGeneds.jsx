import useSWR from '@utils/useSWR'

const useGeneds = (fallbackData) => useSWR('/geneds', fallbackData)

export default useGeneds
