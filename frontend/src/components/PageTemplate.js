const PageTemplate = ({ title, children }) => {
    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {children}
        </div>
    )
}

export default PageTemplate;