import './Card.css'
import iconChevron0 from '../../assets/Icon-chevron-0.svg'
import iconChevron1 from '../../assets/Icon-chevron-1.svg'
import { useState } from 'react'

export default function CardStar({ item }) {
  const [isFolded, setIsFolded] = useState(true)

  return (
    <div className='card-star' >
      <button className='card-header-star' onClick={() => setIsFolded(!isFolded)} >
        <p>{ item.name }</p>
        <img 
          src={ isFolded ? iconChevron0 : iconChevron1 } 
          alt="" 
          className='icon-chevron' 
        />
      </button>
      {
        isFolded ? 
        null : 
        <div className='card-body' >
        <ul>
          <p>Some information about the star</p>
          <p>Some information about the star</p>
        </ul>
      </div>
      }
      
    </div>
  )
}