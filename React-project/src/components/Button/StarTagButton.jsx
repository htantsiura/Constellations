import './StarTagButton.css'

export default function StarTagButton({ name, onClick }) {
  return (
    <button className='star-tag-btn' onClick={onClick}>
      {name}
    </button>
  )
}