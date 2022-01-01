const BackToTop = () => {
    const onClick = () => window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })

    return (
        <div onClick={onClick} className="sm:col-span-2 md:col-span-3 lg:col-span-4 cursor-pointer">
            Back to Top
        </div>
    )
}

export default BackToTop
