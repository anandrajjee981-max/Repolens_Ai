import React from 'react'
import Navbar from '../../components/Navbar'
import Hero from './Hero'
import Feature from './Feature'
import Thankyou from './Thankyou'

const Welcome = () => {
  return (
    <div>
      <Navbar />
      {/* Home ke liye hero parent target div */}
      <div id="home"><Hero /></div>
      {/* Id matching fixed to 'features' */}
      <div id="features"><Feature /></div>
      {/* Id matching added for thank section */}
      <div id="thanks"><Thankyou /></div>
    </div>
  )
}

export default Welcome