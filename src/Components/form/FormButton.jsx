import clsx from 'clsx'
import React from 'react'

const FormButton = ({type="submit",className,children}) => {
    const merged = clsx('bg-kombiblue-500 py-2 px-4 text-white fond-bold rounded-sm',className);
    return (
    <button className={merged} type={type}>
    {children}
    </button>
  )
}

export default FormButton