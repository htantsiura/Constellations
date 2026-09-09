import './Card.css'
import iconChevron0 from '../../assets/Icon-chevron-0.svg'
import iconChevron1 from '../../assets/Icon-chevron-1.svg'
import { useState } from 'react'

export default function ConstellCard({ item, isExpanded, onToggle}) {

  return (
    <div className={`constell-card ${isExpanded ? 'expanded' : ''}`}>
      <button className='constell-card-header' onClick={onToggle} >
        <p>{ item.name }</p>
        <img 
          src={ isExpanded ? iconChevron0 : iconChevron1 } 
          alt="" 
          className='icon-chevron' 
        />
      </button>
      {
        isExpanded && (
        <div className='card-body' >
          <ul>
            <p>Some information about the star</p>
            <p>Some information about the star</p>
            <p>Some information about the star</p>
            <p>Some information about the star</p>
          </ul>
        </div>
      )}
      
    </div>
  )
}