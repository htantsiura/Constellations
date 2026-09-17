import './SidePanel.css'
import SearchInput from '../SearchInput/SearchInput'
import FilterButton from '../FilterButton/FIlterButton'
import StarsData from '../../StarsData.json'
import ConstellationData from '../../ConstellationsData.json' 
import iconStar from '../../assets/Icon-star.svg'
import iconConstell from '../../assets/Icon-constellation.svg'
import SideContent from '../SideContent/SideContent'
import StarCard from '../Cards/StarCard'
import ConstellCard from '../Cards/ConstellCard'
import { useState } from 'react'
import { openConstellation } from '../utilities/constellationUtils.jsx'

const sortByName = (array) => {
  return [...array].sort((a, b) => a.name.localeCompare(b.name));
}

export default function SidePanel() {
  const [isStar, setIsStar] = useState(false);
  const [isConstellation, setIsConstellation] = useState(false);
  const [contentStars, setContentStars] = useState(null);
  const [contentConstell, setContentConstell] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const sortedStars = sortByName(StarsData);
  const sortedConstellations = sortByName(ConstellationData);

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
          /* AllStars.map((item) => ( */
          sortedStars.map((item) => (
            <StarCard
              key={ item.id }
              item={ item }
              isExpanded={ expandedId === item.id }
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id )}
              onConstellationClick={() => openConstellation(item.constellation, setExpandedId, setIsConstellation )}
            />
          ))
        }
        { 
          /* AllConstellations.map((item) => ( */
          sortedConstellations.map((item) => (
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