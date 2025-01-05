import React from 'react'
import { Link } from 'react-router-dom'
import backgroundVideo from '../assets/background.mp4'

const Button = ({ children, to }) => (
  <button className="glass px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-white hover:bg-white/20 transition text-sm sm:text-base">
    <Link to={to}>{children}</Link>
  </button>
)

export default function Home() {
  return (
    <div className="relative flex items-center justify-center min-h-screen text-white overflow-hidden">
      <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <section className="relative z-10 flex flex-col items-center space-y-6 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Just Invoice.io
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Create professional invoices, manage orders, manage sales and finances with ease.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button to="/register">Sign Up</Button>
          <Button to="/login">Login</Button>
        </div>
      </section>
    </div>
  )
}

