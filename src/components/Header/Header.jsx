import logo from '../../assets/header-logo.png'
import './Header.css'

export default function Header({ onOpenAbout, onOpenScene }) {
  return (
    <header className="header">
      <div className='header-logo-container' onClick={ onOpenScene }>
        <img src={ logo } alt="Interactive Constellations" className='header-logo'/>
      </div>
      <nav className='header-nav'>
        <button className='nav-btn' onClick={ onOpenAbout } >About the Project</button>
{/*         <button className='nav-btn' onClick={ onOpenContacts } >Contacts</button>
 */}      </nav>
    </header>
  )
}