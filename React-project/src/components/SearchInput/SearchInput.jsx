import './SearchInput.css'

export default function SearchInput({ value, onChange }) {
  return (
    <div className='search-container'>
      <input 
        type="text"
        placeholder='Search ...'
        value={ value }
        onChange={ onChange }
        className='header-search-input'
      />
    </div>
  )
}