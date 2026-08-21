import './SidePanel.css'
import SearchInput from '../SearchInput/SearchInput'
import FilterButton from '../FilterButton/FIlterButton'
import { StarsAndConstellations } from '../../StarsConstellData'

export default function SidePanel() {
  return (
    <div className="side-panel-container">
      
      <div className='side-panel-header'>
        <SearchInput />
        <FilterButton id="Constellation-btn" bgColor="var(--darkgrey)" />
        <FilterButton id="Star-btn" bgColor="var(--darkgrey)"  />
      </div>

      <div className='side-panel-body'>
        {StarsAndConstellations.map((item) => (
          <p key={item.id}>{item.officialName}</p>
        ))}
      </div>
    </div>
  )
}