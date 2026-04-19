'use client'

import { useState } from 'react'

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    boothLimit: 0,
    price: 0,
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!form.title.trim()) {
      alert('Title is required')
      return
    }

    if (!form.date) {
      alert('Please select a date')
      return
    }

    if (!form.boothLimit || Number(form.boothLimit) <= 0) {
      alert('Booth limit must be greater than 0')
      return
    }

    if (Number(form.price) < 0) {
      alert('Price cannot be negative')
      return
    }

    const organizerId = localStorage.getItem('userId')

    if (!organizerId) {
      alert('You must be logged in')
      return
    }

    const res = await fetch('/api/events/create', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        boothLimit: Number(form.boothLimit),
        price: Number(form.price),
        organizerId,
      }),
    })

    if (res.ok) {
      alert('Event created!')
    } else {
      const error = await res.text()
      alert(error)
    }
  }

  return (
    <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
        <h1 className="text-xl font-bold text-center">Create Event</h1>

        <input name="title" placeholder="Title" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="date" type="date" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="boothLimit" type="number" placeholder="Booth Limit" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} className="w-full border p-2 rounded" />

        <button className="w-full bg-green-500 text-white p-2 rounded">
          Create Event
        </button>
      </form>
      </div>
    </div>
  )
}