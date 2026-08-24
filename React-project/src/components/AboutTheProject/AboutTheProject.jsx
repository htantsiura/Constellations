import './AboutTheProject.css'
import { aboutData } from './AboutData'


function AboutCard({ data }) {
  return (
    <div className='about-card'>
      <p className='about-card-content'>
        <h2><strong>{data.title}</strong></h2>
      </p>
      <p className='about-card-content'>
        {data.description}
      </p>
    </div> 
  )
}

export default function AboutTheProject() {
  return(
    <div id="about-window">
      <AboutCard data={aboutData[0]} />
      <AboutCard data={aboutData[1]} />
      <AboutCard data={aboutData[2]} />
    </div>
  )
}