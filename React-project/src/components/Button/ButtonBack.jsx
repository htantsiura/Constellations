import './ButtonBack.css'

export default function ButtonBack({ id, icon, onClick, isActive, bgColor }) {
  return(
    <button 
      id={ id } 
      className='back-btn'
      /* onClick={ onClick }
      style={{backgroundColor: color}} */
    >
      <img src={ icon } alt="ic" className='mini-icon'/>
      
    </button>
  )
}