import { useState, FormEvent } from 'react'
import { Lock, Mail, Loader2, Building2 } from 'lucide-react'
import { login } from '@/lib/api'
import { useSellerStore } from '@/store/sellerStore'
import { useNavigate } from 'react-router-dom'

export default function SellerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useSellerStore(s => s.setAuth)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      setAuth(data.seller, data.token)
      navigate('/vendedor/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sand/20 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg border border-sand/30">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-coral/10 rounded-2xl flex items-center justify-center mb-3">
            <Building2 size={28} className="text-coral" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Panel de vendedor</h1>
          <p className="text-sm text-gray-500 mt-1">Amor y Aventura</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                placeholder="admin@amoryaventura.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-coral text-white py-3 rounded-xl font-semibold hover:bg-terracota transition-colors disabled:opacity-60">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Entrando...</> : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Acceso exclusivo para administradores
        </p>
      </div>
    </div>
  )
}
