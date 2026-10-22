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

{/* <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section> */}
