const Card = ({ className, children, ...props } =&gt); {
return (
&lt;div
className={`rounded-lg border border-gray-200 ${className || &#39;&#39;}`}
{...props}
&gt;
{children}
&lt;/div&gt;
);
};
