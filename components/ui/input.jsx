const Input = ({ className, ...props }) =&gt; {
return (
&lt;input
className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2
text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400
focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || &#39;&#39;}`}
{...props}
/&gt;
);
};
