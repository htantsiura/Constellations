import './Card.css'
import iconChevron0 from '../../assets/Icon-chevron-0.svg'
import iconChevron1 from '../../assets/Icon-chevron-1.svg'
import { useState } from 'react'
import { formatRA } from '../utilities/formatRA'
import { formatDec } from '../utilities/formatDec'
import ConstellTagButton from '../Button/ConstellTagButton'

function CardBodyLine({ label, value }) {
  return (
    <div className='card-body-line'>
      <p>{ label }</p>
      <p>{ value }</p>
    </div>
  )
}

export default function StarCard({ item, isExpanded, onToggle, onConstellationClick }) {

  //const name = item.name ? item.name : item.bf

  return (
    <div 
      id={`star-${ item.id }`}
      className={`star-card ${isExpanded ? 'expanded' : ''}`}
    >
      <button className='star-card-header' onClick={onToggle} >
        <p>{ item.name } <span className='constellation-name'>{ isExpanded ? null : "/ " + item.constellation }</span></p>
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
            <ConstellTagButton 
              name={( item.constellation)} 
              onClick={ onConstellationClick }
            />
            <CardBodyLine label="id:" value={ item.id } />
            <CardBodyLine label="Right Ascension:" value={ formatRA( item.right_ascension )} />
            <CardBodyLine label="Declination:" value={ formatDec( item.declination )} />
            <CardBodyLine label="App. Magnitude:" value={ item.apparent_magnitude } />
            <CardBodyLine label="Abs. Magnitude:" value={ item.absolute_magnitude } />
            <CardBodyLine label="Distance:" value={ item.distance_light_year + " lyr" } />
            <CardBodyLine label="Spectral Class:" value={ item.spectral_class } />
          </ul>
        </div>
      )}
      
    </div>
  )
}