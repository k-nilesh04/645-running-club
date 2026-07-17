import React from 'react'
import SubscriptionCard from '../components/SubscriptionCard'

const JoinClub = () => {
  return (
    <div>
      <section className="section">
        <div className="text-center mb-10">
          <h2 className="section-title">Become a Premium Runner</h2>
          <p className="text-offwhite/60">Support our mission and receive exclusive club merchandise.</p>
        </div>
        <SubscriptionCard />
      </section>
      
      <section className="section text-center">
        <div className="card bg-primary/10 border-primary/30 max-w-2xl mx-auto">
          <h3 className="font-display text-2xl font-bold text-white mb-2">Ready to Transform Yourself?</h3>
          <p className="text-offwhite/70 mb-6">Join the Sunday Run!</p>
          <a href="#subscribe" className="btn-primary">
            Become a Member
          </a>
        </div>
      </section>
    </div>
  )
}

export default JoinClub
