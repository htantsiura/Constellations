import logo from '../../assets/header-logo.png'
import './Header.css'
import SearchInput from '../SearchInput/SearchInput'

export default function Header() {
  return (
    <header className="header">
      <div className='header-logo-container'>
        <img src={ logo } alt="Interactive Constellations" className='header-logo'/>
      </div>
      <nav className='header-nav'>
        <button className='nav-btn'>About the Project</button>
        <button className='nav-btn'>Contacts</button>
      </nav>
      <SearchInput />
    </header>
  )
}