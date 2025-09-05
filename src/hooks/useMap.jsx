import React, { useContext } from 'react'
import { MapContext } from '../contexts/MapContext'

const useMape = () => {
 const context = useContext(MapContext)
 if(!context){
    throw new Error("the map hook chould be used under a mapcontext provider")
 }
  return context
}

export default useMape
