'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'VENDOR',
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/login')
    } else {
      alert('Registration failed')
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">Register</h1>

        <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" />

        <select name="role" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="VENDOR">Vendor</option>
          <option value="ORGANIZER">Organizer</option>
        </select>

        <button className="w-full bg-green-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  )
}