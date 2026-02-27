const page = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center mt-4">About</h1>

      <div className="max-w-4xl mx-auto space-y-8 p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <img
              src="/ticket-system.png"
              alt="Ticket system illustration"
              className="w-full rounded shadow"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-semibold mb-2">What is TicketHub?</h2>
            <p className="text-gray-700 leading-relaxed">
              TicketHub is a lightweight incident and support ticket management
              system built with Next.js and Tailwind CSS. It enables users to
              create, track, and resolve tickets across various departments and
              categories. Built with modern React paradigms, it showcases
              features like server components, parallel routes, and dynamic
              skeleton loaders to provide a smooth user experience.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Key Features</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Role based navigation (admin, support, user)</li>
            <li>Grid-based blog and detail pages with skeleton loaders</li>
            <li>Parallel route demo for creating tickets via modal</li>
            <li>Mock authentication API and user session handling</li>
            <li>Responsive design powered by Tailwind CSS</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <a
            href="/dashboard/create-ticket"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try it now
          </a>
          <a
            href="/blog"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Read our blog
          </a>
        </div>
      </div>
    </>

  )
}

export default page
