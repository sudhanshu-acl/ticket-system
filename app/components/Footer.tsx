import React from 'react'

const Footer = () => {
  return (
    <div className='min-w-auto bg-gray-100 text-center p-4 mt-8'>
        <p className='text-sm text-gray-500'>© {new Date().getFullYear()} ACL digital. All rights reserved.</p>
    </div>
  )
}

export default Footer