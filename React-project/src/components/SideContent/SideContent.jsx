import './SideContent.css'

export default function SideContent({ isStar , data }) {
  return (
    <div>
      {data.map((item) => (
        <p key={item.id}>
          {item.officialName} / {item.entity}
        </p>
      ))}
    </div>
  )
}