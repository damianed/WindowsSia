function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-arrow-left">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  )
}
export default function ViewBase ( { title, children, buttons, onBack }) {
  return (
    <div className="h-full">
      <div className="fixed top-0 flex content-center w-full h-12 bg-gray-900 border border-gray-700 row">
      {
        onBack &&
          <div className="p-1 my-auto ml-2 text-center align-middle bg-gray-700 cursor-pointer hover:bg-gray-600 w-7 h-7" onClick={onBack}>
            <BackIcon />
          </div>
      }
        <span className="m-auto font-bold">{title}</span>
      </div>
      <div className="h-full mt-16">
        {children}
      </div>
      <div className="fixed bottom-0 w-full h-12 px-2 py-2 overflow-y-scroll bg-gray-900 border border-gray-700 grid justify-items-end">
        {buttons && buttons.map((element, index) => {
          return (
            <button className="px-2 bg-gray-700 hover:bg-gray-600" key={index} onClick={element.onClick}>{element.text}</button>
          )
        })}
      </div>
    </div>
  )
}
