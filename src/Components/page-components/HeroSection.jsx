import React from 'react'
import SearchBar from './SearchBar'

const HeroSection = ({children,url="/default/carsharing-2.jpg",label}) => {
  return (
    <div className='w-full  relative'>
        <img src={url} className='w-full object-cover h-[80vh]' alt="" />
        <div className="absolute top-[50%] w-full text-center  text-4xl font-bold z-1 text-white">
    
            <p className=''>{label}</p>
        
        </div>
        <SearchBar/>
    </div>
  )
}

export default HeroSection