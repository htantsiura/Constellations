import './SidePanel.css'
import SearchInput from '../SearchInput/SearchInput'
import FilterButton from '../FilterButton/FIlterButton'
import { AllStars } from '../../StarsData'
import { AllConstellations } from '../../ConstellationsData'
import iconStar from '../../assets/Icon-star.svg'
import iconConstell from '../../assets/Icon-constellation.svg'
import SideContent from '../SideContent/SideContent'
import CardStar from '../Cards/Card'
import { useState } from 'react'

export default function SidePanel() {
  const [isStar, setIsStar] = useState(false);
  const [isConstellation, setIsConstellation] = useState(false);
  const [contentStars, setContentStars] = useState(null)
  const [contentConstell, setContentConstell] = useState(null)

  return (
    <div className="side-panel-container">
      <div className='side-panel-header'>
        <SearchInput />
        <FilterButton 
          id="Constellation-btn" 
          icon={iconConstell} 
          onClick={() => {
            setIsConstellation( !isConstellation ),
            setContentConstell( !isConstellation ? SideContent(isConstellation, AllConstellations) : null )
          }}
          isActive={isConstellation}
          bgColor="var(--primary-500)"
        />
        <FilterButton 
          id="Star-btn" 
          icon={iconStar} 
          onClick={() => {
            setIsStar( !isStar ), 
            setContentStars( !isStar ? SideContent(isStar, AllStars) : null )
          }}
          isActive={isStar}
          bgColor="var(--secondary-750)"
        />
      </div>
      <div className='side-panel-body'>
        { 
          AllStars.map((item) => (
            <CardStar
              key={ item.id }
              item={ item }
            />

          ))
        }
        {/* <CardStar item={ AllStars[1]} />
        <CardStar item={ AllStars[2]} />
        <CardStar item={ AllStars[3]} />
        <CardStar item={ AllStars[1]} />
        <CardStar item={ AllStars[2]} />
        <CardStar item={ AllStars[3]} /> */}
      </div>
    </div>
  )
}