const CloseIcon = ({ ...props }) => {
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
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </div>
    )
}

export default CloseIcon
