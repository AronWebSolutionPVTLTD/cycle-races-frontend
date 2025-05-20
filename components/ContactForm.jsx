import { useState } from 'react'

export default function ContactForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={()=>handleSubmit(e)}>
      <label htmlFor="email">E-Mailadres</label>
      <input
        type="email"
        id="email"
        placeholder="Vul je e-mailadres in"
        className="form-control mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="message">Jouw bericht</label>
      <textarea
        id="message"
        placeholder="Type hier je bericht"
        className="form-control mb-4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex-box items-center gap-3">
        <img src="/images/rb.png" alt="" width={40} height={40} />
        <input type="submit" value="verzend je bericht" className="glob-btn" />
      </div>
    </form>
  )
}
