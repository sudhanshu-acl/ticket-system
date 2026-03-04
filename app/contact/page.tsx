import React from 'react'

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* Left Side: Contact Information */}
        <div className="md:w-1/3 bg-blue-600 text-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-blue-100 text-sm mb-8 leading-relaxed">
              Have a question, feedback, or need help with a ticket? We'd love to hear from you. Reach out to us using any of the methods below.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <h4 className="font-semibold mb-1">Our Office</h4>
                  <p className="text-blue-100 text-sm">123 Tech Avenue, Suite 400<br />San Francisco, CA 94107</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-blue-100 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">✉️</span>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-blue-100 text-sm">support@tickethub.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            {/* Social Icons (Placeholders) */}
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <span className="sr-only">Twitter</span>
              𝕏
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <span className="sr-only">LinkedIn</span>
              in
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <span className="sr-only">GitHub</span>
              gh
            </a>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="md:w-2/3 p-8 md:p-12 bg-white">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea
                rows={5}
                placeholder="Please describe your inquiry in detail..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all bg-gray-50 resize-y"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md shadow-blue-600/20"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default ContactPage
