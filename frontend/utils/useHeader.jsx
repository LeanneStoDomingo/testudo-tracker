import { useReducer } from "react"

const initialState = {
    dropdownOpen: 'hidden',
    menuOpen: 'hidden',
    searchOpen: 'hidden',
    open: false
}

const actions = {
    OPEN_MENU: 'OPEN_MENU',
    TOGGLE_DROPDOWN: 'TOGGLE_DROPDOWN',
    OPEN_SEARCH: 'OPEN_SEARCH',
    CLOSE: 'CLOSE',
}

const reducer = (state, action) => {
    switch (action.type) {
        case actions.OPEN_MENU: {
            return {
                dropdownOpen: 'hidden',
                menuOpen: '',
                searchOpen: 'hidden',
                open: true
            }
        }
        case actions.TOGGLE_DROPDOWN: {
            return {
                dropdownOpen: !!state.dropdownOpen ? '' : 'hidden',
                menuOpen: '',
                searchOpen: 'hidden',
                open: true
            }
        }
        case actions.OPEN_SEARCH: {
            return {
                dropdownOpen: 'hidden',
                menuOpen: 'hidden',
                searchOpen: '',
                open: true
            }
        }
        case actions.CLOSE: {
            return {
                dropdownOpen: 'hidden',
                menuOpen: 'hidden',
                searchOpen: 'hidden',
                open: false
            }
        }
        default: {
            return state
        }
    }
}

const useHeader = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const openMenu = () => dispatch({ type: actions.OPEN_MENU })

    const toggleDropdown = () => dispatch({ type: actions.TOGGLE_DROPDOWN })

    const openSearch = () => dispatch({ type: actions.OPEN_SEARCH })

    const close = () => dispatch({ type: actions.CLOSE })

    return { state, openMenu, toggleDropdown, openSearch, close }
}

export default useHeader
