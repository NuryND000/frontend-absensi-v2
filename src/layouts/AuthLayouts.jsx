import React, {useState} from 'react';
import Navbar from '../components/Navbar.jsx';

export default function AuthLayouts({name, children}) {
  return (
    <div className='container'>
      <Navbar/>
    <main>{children}</main>
    </div>
  )
}
