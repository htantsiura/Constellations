import './Card.css'
import iconChevron0 from '../../assets/Icon-chevron-0.svg'
import iconChevron1 from '../../assets/Icon-chevron-1.svg'
import { useState } from 'react'

export default function CardStar({ item, isExpanded, onToggle}) {

  return (
    <div className={`card-star ${isExpanded ? 'expanded' : ''}`}>
      <button className='card-header-star' onClick={onToggle} >
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