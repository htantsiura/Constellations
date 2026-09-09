import './SidePanel.css'
import SearchInput from '../SearchInput/SearchInput'
import FilterButton from '../FilterButton/FIlterButton'
import { AllStars } from '../../StarsData'
import { AllConstellations } from '../../ConstellationsData'
import iconStar from '../../assets/Icon-star.svg'
import iconConstell from '../../assets/Icon-constellation.svg'
import SideContent from '../SideContent/SideContent'
import StarCard from '../Cards/StarCard'
import ConstellCard from '../Cards/ConstellCard'
import { useState } from 'react'

export default function SidePanel() {
  const [isStar, setIsStar] = useState(false);
  const [isConstellation, setIsConstellation] = useState(false);
  const [contentStars, setContentStars] = useState(null);
  const [contentConstell, setContentConstell] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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
            <StarCard
              key={ item.id }
              item={ item }
              isExpanded={ expandedId === item.id }
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id )}
            />
          ))
        }
        { 
          AllConstellations.map((item) => (
            <ConstellCard
              key={ item.id }
              item={ item }
              isExpanded={ expandedId === item.id }
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id )}
            />
          ))
        }
      </div>
    </div>
  )
}