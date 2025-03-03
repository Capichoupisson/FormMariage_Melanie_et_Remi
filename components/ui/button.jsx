const Button = ({ className, variant = &quot;default&quot;, size = &quot;default&quot;, ...props }) =&gt; {
const baseStyles = &quot;inline-flex items-center justify-center rounded-md font-medium
transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
disabled:opacity-50 disabled:pointer-events-none&quot;;

const variants = {
default: &quot;bg-gray-900 text-white hover:bg-gray-700&quot;,
destructive: &quot;bg-red-500 text-white hover:bg-red-600&quot;,
outline: &quot;border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900&quot;,
secondary: &quot;bg-gray-100 text-gray-900 hover:bg-gray-200&quot;,
ghost: &quot;hover:bg-gray-100 hover:text-gray-900&quot;,
link: &quot;underline-offset-4 hover:underline text-gray-900&quot;
};

const sizes = {
default: &quot;h-10 py-2 px-4&quot;,
sm: &quot;h-9 px-3 rounded-md&quot;,
lg: &quot;h-11 px-8 rounded-md&quot;
};

return (
&lt;button
className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || &#39;&#39;}`}
{...props}
/&gt;
);
};
