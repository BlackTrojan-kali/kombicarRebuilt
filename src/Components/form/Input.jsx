import clsx from "clsx";

export default function Input({type,label,desc,hint,placeholder,className,...props}){
    const merged =clsx("w-full rounded-sm px-2 py-1 dark:text-white dark:border-gray-400 focus:border-2 focus:border-gray-400 border-1 border-black outline-0",className)
    return(
        <div>
        <label htmlFor="" className="my-2 ">
            {label}
        </label>
        <input type={type} className={merged}
            placeholder={placeholder} {...props}
        />
        {hint && <span className="text-red-500 text-xs">{hint}</span>}
        {desc && <p className="text-xs">{desc}</p>}
        </div>
    );
}