import { useState } from 'react'
import './FilterButton.css'

export default function FilterButton({ id, bgColor, onClick }) {
  const [isClicked, setIsClicked] = useState(0);

  return(
    <button 
      id={ id } 
      className='filter-btn'
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      FF
    </button>
  )
}