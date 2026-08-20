import './SearchInput.css'

export default function SearchInput() {
  return (
    <div className='search-container'>
      <input 
        type="text"
        placeholder='Search ...'
        className='header-search-input'
      />
      {/* <div className='star-list-btn-container'>
        <button className='filter-btn'>icon1</button>
        <button className='filter-btn'>icon2</button>
      </div> */}
    </div>
  )
}