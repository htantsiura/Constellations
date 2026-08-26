import './AboutTheProject.css'
import ButtonBack from '../Button/ButtonBack'
import iconBackArrow from '../../assets/Icon-back-arrow.svg'

export default function Contacts({ onClose }) {
  return(
    <div className='page-about'>
      <div className='page-about-header' >
        <ButtonBack 
          icon={ iconBackArrow }
          onClick={ onClose }
          />
      </div>
      <div className='page-about-body'>
        <div className='about-card'>
          <p className='about-card-title'><h6>Contacts</h6></p>
          <a href="https://hennadiitantsiura.tilda.ws/" className='sm-link' >Portfolio</a><br/>
          <a href="https://www.linkedin.com/in/htantsiura/" className='sm-link' >Linkedin</a>
          <p>h.tantsiura@gmail.com</p>
        </div>
      </div>
    </div>
  )
}