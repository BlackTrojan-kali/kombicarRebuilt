import clsx from "clsx";
import React from "react";

const Button = ({ type = "button", className, children, ...props }) => {
    const merged = clsx(
        "bg-kombigreen-500 transition duration-250 cursor-pointer hover:bg-kombigreen-700 py-1 px-10 rounded-full font-bold text-white",
        className
    );

    return (
        // ⭐️ Passez la propriété 'type' et le reste des 'props' à l'élément button
        <button type={type} className={merged} {...props}>
            {children}
        </button>
    );
};

export default Button;