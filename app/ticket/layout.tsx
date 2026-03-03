import { pagePropsChildNode } from "../utils/type"
import ProtectedRoute from "../components/ProtectedRoute"

const layout = ({ children }: pagePropsChildNode) => {
  return (
    <ProtectedRoute>
      <div className="m-10 flex justify-center flex-col gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600 mt-1">Manage and track support tickets</p>
        </div>
        {children}
      </div>
    </ProtectedRoute>
  )
}

export default layout
