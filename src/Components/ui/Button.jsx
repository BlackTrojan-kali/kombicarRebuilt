import clsx from "clsx"

const Button = ({type="button",className,children,...props}) => {
  const merged = clsx("bg-kombigreen-500 transition duration-250 cursor-pointer hover:bg-kombigreen-700 py-1 px-10 rounded-full font-bold text-white"
    ,className)
    return (
    <button className={merged}>{children}</button>
  )
}

export default Button