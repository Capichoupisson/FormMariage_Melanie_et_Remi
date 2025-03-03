const Card = ({ className, children, ...props }) => {
    return (
        <div 
            className={`rounded-lg border border-gray-200 ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
};
