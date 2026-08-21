import { useState } from 'react'
import './FilterButton.css'

export default function FilterButton({ id, icon, onClick, isActive, bgColor }) {

  let color = isActive ? bgColor : "var(--darkgrey)";

  return(
    <button 
      id={ id } 
      className='filter-btn'
      onClick={ onClick }
      style={{backgroundColor: color}}
    >
      <img src={ icon } alt="ic" className='mini-icon'/>
    </button>
  )
} 