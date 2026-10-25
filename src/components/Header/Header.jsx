import logo from '../../assets/header-logo.png'
import './Header.css'

export default function Header({ onOpenAbout, onOpenContacts }) {
  return (
    <header className="header">
      <div className='header-logo-container'>
        <img src={ logo } alt="Interactive Constellations" className='header-logo'/>
      </div>
      <nav className='header-nav'>
        <button className='nav-btn' onClick={ onOpenAbout } >About</button>
        <button className='nav-btn' onClick={ onOpenContacts } >Contacts</button>
      </nav>
    </header>
  )
}