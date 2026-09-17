import './Card.css'
import iconChevron0 from '../../assets/Icon-chevron-0.svg'
import iconChevron1 from '../../assets/Icon-chevron-1.svg'
import { useState } from 'react'
import { formatRA } from '../utilities/formatRA'
import { formatDec } from '../utilities/formatDec'
import StarTagButton from '../Button/StarTagButton'

const formatStarName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); 
};

function CardBodyLine({ label, value }) {
  return (
    <div className='card-body-line'>
      <p>{ label }</p>
      <p>{ value }</p>
    </div>
  )
}

export default function ConstellCard({ item, isExpanded, onToggle}) {

  return (
    <div 
      id={`constell-${ item.id }`}
      className={`constell-card ${isExpanded ? 'expanded' : ''}`}
    >
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
            <CardBodyLine label="Right Ascension:" value={ formatRA( item.right_ascension )} />
            <CardBodyLine label="Declination:" value={ formatDec( item.declination )} />
            <CardBodyLine label="Area:" value={ item.square + " sq.d."} />
            <CardBodyLine label="Main Stars Qty:" value={ item.main_stars_qty } />
            <CardBodyLine label="Brightest Star:" value={ item.brightest_star } />
            <p>Stars:</p>
            <div className='stars-tags-container'>
              { item.list_of_main_stars.map((star, index) => (
                  <StarTagButton
                    key={ index }
                    name={ formatStarName(star) }
                    onClick={() => console.log(`Clicked: ${star}`)}
                  />
                )) 
              }
            </div>
          </ul>
        </div>
      )}
      
    </div>
  )
}