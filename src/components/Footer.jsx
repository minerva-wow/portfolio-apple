import React from 'react'
import { footerLinks } from '../constants'

const Footer = () => {
  return (
    <footer className='py-5 sm:px-10 px-5'>
      <div className='screen-max-width'>
        <div>
          <p className='font-semibold text-gray text-xs'>
            More ways to shop:{' '}
            <span className='underline text-blue'>
              Find an Apple Store
            </span>
            {''} or {''}
            <span className='underline text-blue'>
              other retailer
            </span>
            {' '}near you. Or call 1-800-MY-APPLE.
          </p>
        </div>
        <div className='bg-neutral-700 my-5 h-[1px] w-full'></div>
        <div className='flex md:flex-row flex-col md:items-center justify-between'>
          <p className='text-gray text-xs'>
            Copyright © 2024 Apple Inc. All rights reserved.
          </p>
          <div className='flex'>
            {footerLinks.map((link,i) => (
              <p key={link} className='text-gray text-xs'>
                {link}
                {i !== footerLinks.length - 1 && '\u00A0 | \u00A0'}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer