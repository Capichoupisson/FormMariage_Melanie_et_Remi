const Dialog = ({ children, open, onOpenChange }) => {
    const [isOpen, setIsOpen] = React.useState(open || false);
    
    React.useEffect(() => {
        if (open !== undefined) {
            setIsOpen(open);
            if (onOpenChange) {
                onOpenChange(open);
            }
        }
    }, [open, onOpenChange]);
    
    return (
        <React.Fragment>
            {children}
            {isOpen && (
                <div className="dialog-root">
                    <div className="dialog-overlay" onClick={() => {
                        setIsOpen(false);
                        if (onOpenChange) onOpenChange(false);
                    }} />
                    <div className="dialog-content-wrapper">
                        {React.Children.map(children, child => {
                            if (child?.type?.displayName === 'DialogContent') {
                                return React.cloneElement(child, {
                                    onClose: () => {
                                        setIsOpen(false);
                                        if (onOpenChange) onOpenChange(false);
                                    }
                                });
                            }
                            return null;
                        })}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

const DialogTrigger = ({ asChild, children, ...props }) => {
    const context = React.useContext(DialogContext);
    
    const handleClick = (e) => {
        if (props.onClick) props.onClick(e);
        context.setIsOpen(true);
    };
    
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ...props,
            onClick: handleClick
        });
    }
    
    return (
        <button type="button" onClick={handleClick} {...props}>
            {children}
        </button>
    );
};

const DialogContent = ({ children, className, onClose, ...props }) => {
    return (
        <React.Fragment>
            <div className="dialog-overlay" onClick={onClose} />
            <div className={`dialog-content ${className || ''}`} {...props}>
                {children}
            </div>
        </React.Fragment>
    );
};
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, children, ...props }) => {
    return (
        <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`} {...props}>
            {children}
        </div>
    );
};

const DialogTitle = ({ className, children, ...props }) => {
    return (
        <h3 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`} {...props}>
            {children}
        </h3>
    );
};

const DialogDescription = ({ className, children, ...props }) => {
    return (
        <p className={`text-sm text-gray-500 ${className || ''}`} {...props}>
            {children}
        </p>
    );
};

const DialogFooter = ({ className, children, ...props }) => {
    return (
        <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ''}`} {...props}>
            {children}
        </div>
    );
};

const DialogContext = React.createContext({
    isOpen: false,
    setIsOpen: () => {}
});
