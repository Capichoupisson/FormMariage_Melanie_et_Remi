const Dialog = ({ children, open, onOpenChange }) =&gt; {
const [isOpen, setIsOpen] = React.useState(open || false);

React.useEffect(() =&gt; {
if (open !== undefined) {
setIsOpen(open);
if (onOpenChange) {
onOpenChange(open);
}
}
}, [open, onOpenChange]);

return (
&lt;React.Fragment&gt;
{children}
{isOpen &amp;&amp; (
&lt;div className=&quot;dialog-root&quot;&gt;
&lt;div className=&quot;dialog-overlay&quot; onClick={() =&gt; {
setIsOpen(false);
if (onOpenChange) onOpenChange(false);
}} /&gt;
&lt;div className=&quot;dialog-content-wrapper&quot;&gt;
{React.Children.map(children, child =&gt; {
if (child?.type?.displayName === &#39;DialogContent&#39;) {
return React.cloneElement(child, {
onClose: () =&gt; {
setIsOpen(false);
if (onOpenChange) onOpenChange(false);
}
});
}
return null;
})}
&lt;/div&gt;

&lt;/div&gt;
)}
&lt;/React.Fragment&gt;
);
};

const DialogTrigger = ({ asChild, children, ...props }) =&gt; {
const context = React.useContext(DialogContext);

const handleClick = (e) =&gt; {
if (props.onClick) props.onClick(e);
context.setIsOpen(true);
};

if (asChild &amp;&amp; React.isValidElement(children)) {
return React.cloneElement(children, {
...props,
onClick: handleClick
});
}

return (
&lt;button type=&quot;button&quot; onClick={handleClick} {...props}&gt;
{children}
&lt;/button&gt;
);
};

const DialogContent = ({ children, className, onClose, ...props }) =&gt; {
return (
&lt;React.Fragment&gt;
&lt;div className=&quot;dialog-overlay&quot; onClick={onClose} /&gt;

&lt;div className={`dialog-content ${className || &#39;&#39;}`} {...props}&gt;
{children}
&lt;/div&gt;
&lt;/React.Fragment&gt;
);
};
DialogContent.displayName = &#39;DialogContent&#39;;

const DialogHeader = ({ className, children, ...props }) =&gt; {
return (
&lt;div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || &#39;&#39;}`}
{...props}&gt;
{children}
&lt;/div&gt;
);
};

const DialogTitle = ({ className, children, ...props }) =&gt; {
return (
&lt;h3 className={`text-lg font-semibold leading-none tracking-tight ${className || &#39;&#39;}`}
{...props}&gt;
{children}
&lt;/h3&gt;
);
};

const DialogDescription = ({ className, children, ...props }) =&gt; {
return (
&lt;p className={`text-sm text-gray-500 ${className || &#39;&#39;}`} {...props}&gt;
{children}
&lt;/p&gt;
);
};

const DialogFooter = ({ className, children, ...props }) =&gt; {
return (
&lt;div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2
${className || &#39;&#39;}`} {...props}&gt;
{children}
&lt;/div&gt;
);
};

const DialogContext = React.createContext({
isOpen: false,
setIsOpen: () =&gt; {}
});
