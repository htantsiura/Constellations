import './SidePanel.css'
import SearchInput from '../SearchInput/SearchInput'
import FilterButton from '../FilterButton/FIlterButton'
import { AllStars } from '../../StarsData'
import { AllConstellations } from '../../ConstellationsData'
import iconStar from '../../assets/Icon-star.png'
import iconConstell from '../../assets/Icon-constellation.png'
import { useState } from 'react'

export default function SidePanel() {
  const [isStar, setIsStar] = useState(false);
  const [isConstellation, setIsConstellation] = useState(false);

  return (
    <div className="side-panel-container">
      
      <div className='side-panel-header'>
        <SearchInput />
        <FilterButton 
          id="Constellation-btn" 
          icon={iconStar} 
          /* onClick={() => handleClick(isStar)} */
          onClick={() => setIsStar(!isStar)}
          isActive={isStar}
          bgColor="var(--secondary-750)"
        />
        <FilterButton 
          id="Star-btn" 
          icon={iconConstell} 
          onClick={() => setIsConstellation(!isConstellation)}
          isActive={isConstellation}
          bgColor="var(--primary-500)"
        />
      </div>

      <div className='side-panel-body'>
        {AllStars.map((item) => (
          <p key={item.id}>
            {item.officialName} / {item.entity}
          </p>
        ))}
      </div>
    </div>
    
  )
  
}