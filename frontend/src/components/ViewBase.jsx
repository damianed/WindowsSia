export default function ViewBase ( { title, children, buttons }) {
  return (
    <div>
      <div className="fixed top-0 content-center w-full h-12 bg-gray-900 border border-gray-700 grid">
        <span className="font-bold">{title}</span>
      </div>
      <div className="mt-16">
        {children}
      </div>
      <div className="fixed bottom-0 w-full h-12 px-2 py-2 bg-gray-900 border border-gray-700 grid justify-items-end">
        {buttons.map((element, index) => {
          return (
            <button className="px-2 text-gray-900 bg-white border border-gray-900" key={index} onClick={element.onClick}>{element.text}</button>
          )
        })}
      </div>
    </div>
  )
}
