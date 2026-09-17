import './ConstellTagButton.css'

export default function ConstellTagButton({ name, onClick }) {
  return (
    <button className='constell-tag-btn' onClick={onClick}>
      {name}
    </button>
  )
}