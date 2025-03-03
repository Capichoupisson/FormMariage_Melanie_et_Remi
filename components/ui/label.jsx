const Label = ({ htmlFor, className, children, ...props }) =&gt; {
return (
&lt;label
htmlFor={htmlFor}
className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed
peer-disabled:opacity-70 ${className || &#39;&#39;}`}
{...props}
&gt;
{children}
&lt;/label&gt;
);
};
