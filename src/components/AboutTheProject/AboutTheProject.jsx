import './AboutTheProject.css'
import { aboutData } from './AboutData'
import ButtonBack from '../Button/ButtonBack'
import iconBackArrow from '../../assets/Icon-back-arrow.svg'

function AboutCard({ data }) {
  return (
    <div className='about-card'>
      <p className='about-card-title'>
        <h6>{data.title}</h6>
      </p>
      <p className='about-card-text'>
        {data.description}
      </p>
    </div> 
  )
}

export default function AboutTheProject({ onClose }) {
  return(
    <div className='page-about'>
      <div className='page-about-header' >
        <ButtonBack 
          icon={ iconBackArrow }
          onClick={ onClose }
          />
      </div>
      <div className='page-about-body'>
        <AboutCard data={aboutData[0]} />
        <AboutCard data={aboutData[1]} />
      </div>
    </div>
  )
}