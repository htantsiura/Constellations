import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import SidePanel from './components/SidePanel/SidePanel'
import AboutTheProject from './components/AboutTheProject/AboutTheProject'
import Contacts from './components/AboutTheProject/Contacts'
import SkyCanvas from './components/SkyCanvas/SkyCanvas'

import { openConstellationCard } from './components/utilities/constellationUtils.jsx'
import { openStarCard } from './components/utilities/starUtils.jsx'


export default function App() {
  const [activePage, setActivePage] = useState('panel')

  const [isStar, setIsStar] = useState(true);
  const [isConstellation, setIsConstellation] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStarSelect = (starId) => {
    openStarCard(starId, setExpandedId, setIsStar, setSearchQuery);
  }

  const handleConstellationSelect = (constellId) => {
    openConstellationCard(constellId, setExpandedId, setIsConstellation, setSearchQuery)
  }

  return (
    <>
      <div className='canvas-container'>
        <SkyCanvas 
          onStarClick={handleStarSelect} 
          onConstellationClick={handleConstellationSelect}
          expandedId={expandedId}
        />
      </div>
      <div className='ui-container'>
        <Header 
          onOpenAbout={() => setActivePage('about')}
          onOpenContacts={() => setActivePage('contacts')}
        />
        <main className='main-section'>
          { activePage === 'about' && <AboutTheProject onClose={() => setActivePage('panel')} /> }
          { activePage === 'contacts' && <Contacts onClose={() => setActivePage('panel')} /> }
          { activePage === 'panel' && 
            <SidePanel 
              isStar={isStar} setIsStar={setIsStar}
              isConstellation={isConstellation} setIsConstellation={setIsConstellation}
              expandedId={expandedId} setExpandedId={setExpandedId}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            /> }
        </main>
      </div>
    </>
  )
}

