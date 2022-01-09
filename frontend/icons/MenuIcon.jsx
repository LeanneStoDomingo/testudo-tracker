const MenuIcon = ({ ...props }) => {
    return (
        <div {...props} className="w-7 h-7">
            <svg
                className="w-7 h-7"
                data-darkreader-inline-stroke=""
                fill="none"
                stroke="currentColor"
                style={{ '--darkreader-inline-stroke': 'currentColor' }}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                />
            </svg>
        </div>
    )
}

export default MenuIcon
