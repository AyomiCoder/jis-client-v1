import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({ children, to, primary = false }) => (
  <button className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${primary ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
    <Link to={to}>{children}</Link>
  </button>
)

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
      <section className="flex flex-col items-center space-y-8 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-blue-600">
            Just Invoice.io
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto">
            Create professional invoices, manage orders, sales and finances with ease.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button to="/register" primary>Sign Up</Button>
          <Button to="/login">Login</Button>
        </div>
      </section>
    </div>
  )
}

