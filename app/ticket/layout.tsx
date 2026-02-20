import { pagePropsChildNode } from "../utils/type"

const layout = ({children}: pagePropsChildNode) => {
  return (
    <div>
        {/* Not that this will be shown both on the listing and details...  because of layout */}
        <h1 className="p-2 text-4xl text-zinc-900 text-center">Tickets</h1>
        {children}
    </div>
  )
}

export default layout
