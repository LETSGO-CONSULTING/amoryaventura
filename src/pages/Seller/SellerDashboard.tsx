import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, ShoppingBag, TrendingUp, LogOut, Plus, Pencil, Trash2,
  Loader2, X, Check, Upload, ChevronDown, AlertCircle, Building2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSellerStore } from '@/store/sellerStore'
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getOrders, updateOrderStatus, uploadImage,
} from '@/lib/api'
import type { Order } from '@/lib/api'
import type { Product, ProductCategory } from '@/models'

const CATEGORIES: Exclude<ProductCategory, 'Todos'>[] = ['Café', 'Miel', 'Chocolates', 'Artesanías', 'Textiles', 'Gourmet']

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pendiente',   color: 'bg-yellow-100 text-yellow-700' },
  paid:      { label: 'Pagado',      color: 'bg-blue-100 text-blue-700' },
  shipped:   { label: 'Enviado',     color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Completado',  color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado',   color: 'bg-red-100 text-red-700' },
}

const NEXT_STATUS: Record<string, string> = {
  paid: 'shipped',
  shipped: 'completed',
}

// Product form modal
type ProductFormData = {
  name: string; category: ProductCategory; image: string; price: string; originalPrice: string;
  description: string; region: string; stock: string; isNew: boolean; isFeatured: boolean;
}

const emptyForm: ProductFormData = {
  name: '', category: 'Café', image: '', price: '', originalPrice: '',
  description: '', region: '', stock: '0', isNew: false, isFeatured: false,
}

function ProductModal({ product, onClose, onSave }: {
  product: Product | null
  onClose: () => void
  onSave: () => void
}) {
  const [form, setForm] = useState<ProductFormData>(
    product
      ? {
          name: product.name, category: product.category, image: product.image,
          price: String(product.price), originalPrice: product.originalPrice ? String(product.originalPrice) : '',
          description: product.description, region: product.region,
          stock: String(product.stock), isNew: product.isNew ?? false, isFeatured: product.isFeatured ?? false,
        }
      : emptyForm
  )
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm(f => ({ ...f, image: url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.description || !form.region || !form.image) {
      setError('Completa todos los campos requeridos')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = {
        name: form.name,
        category: form.category,
        image: form.image,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        description: form.description,
        region: form.region,
        stock: parseInt(form.stock),
        isNew: form.isNew,
        isFeatured: form.isFeatured,
      }
      if (product) await updateProduct(product.id, data)
      else await createProduct(data)
      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-sand/40 px-5 py-4 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">{product ? 'Editar producto' : 'Nuevo producto'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen *</label>
            {form.image ? (
              <div className="relative group">
                <img src={form.image} alt="preview" className="w-full h-40 object-cover rounded-xl" />
                <button onClick={() => setForm(f => ({ ...f, image: '' }))}
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} className="text-red-500" />
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-coral hover:bg-coral/5 transition-colors text-gray-400 hover:text-coral">
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <><Upload size={20} /><span className="text-sm">Subir imagen</span></>}
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            <div className="mt-2">
              <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-coral/30"
                placeholder="O pega una URL de imagen" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ProductCategory }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Región *</label>
              <input value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30"
                placeholder="Cajamarca" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/) *</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio original (S/)</label>
              <input type="number" step="0.01" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30"
                placeholder="Opcional" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30" />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isNew} onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))}
                  className="w-4 h-4 rounded accent-coral" />
                <span className="text-sm text-gray-700">Nuevo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                  className="w-4 h-4 rounded accent-coral" />
                <span className="text-sm text-gray-700">Destacado</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 resize-none" />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-coral text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-terracota transition-colors disabled:opacity-60">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {product ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function SellerDashboard() {
  const seller = useSellerStore(s => s.seller)
  const logout = useSellerStore(s => s.logout)
  const navigate = useNavigate()

  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null | 'new'>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!seller) { navigate('/vendedor'); return }
    loadProducts()
  }, [seller])

  useEffect(() => {
    if (tab === 'orders') loadOrders()
  }, [tab])

  const loadProducts = async () => {
    setLoadingProducts(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } finally {
      setLoadingProducts(false)
    }
  }

  const loadOrders = async () => {
    setLoadingOrders(true)
    try {
      const data = await getOrders()
      setOrders(data)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    setDeletingId(id)
    try {
      await deleteProduct(id)
      setProducts(p => p.filter(x => x.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const handleStatusAdvance = async (orderId: string, currentStatus: string) => {
    const next = NEXT_STATUS[currentStatus]
    if (!next) return
    setStatusUpdating(orderId)
    try {
      await updateOrderStatus(orderId, next)
      setOrders(o => o.map(x => x.id === orderId ? { ...x, status: next } : x))
    } finally {
      setStatusUpdating(null)
    }
  }

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)

  const handleLogout = () => { logout(); navigate('/vendedor') }

  if (!seller) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-coral/10 rounded-xl flex items-center justify-center">
            <Building2 size={16} className="text-coral" />
          </div>
          <span className="font-bold text-gray-900 text-sm">Panel Vendedor</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">{seller.name}</span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Package, label: 'Productos', value: products.length, color: 'text-coral bg-coral/10' },
            { icon: ShoppingBag, label: 'Pedidos', value: orders.length, color: 'text-blue-600 bg-blue-50' },
            { icon: TrendingUp, label: 'Ingresos', value: `S/ ${totalRevenue.toFixed(0)}`, color: 'text-green-600 bg-green-50' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-bold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
          {[{ key: 'products', label: 'Productos' }, { key: 'orders', label: 'Pedidos' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Products tab */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Productos</h2>
              <button onClick={() => setEditProduct('new')} className="flex items-center gap-2 bg-coral text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-terracota transition-colors">
                <Plus size={15} /> Nuevo producto
              </button>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-coral" /></div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Producto</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Categoría</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">Precio</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">Stock</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {products.map(product => (
                          <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                                  <p className="text-xs text-gray-400">{product.region}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{product.category}</td>
                            <td className="px-4 py-3 text-right font-medium">
                              S/ {product.price}
                              {product.originalPrice && <span className="text-xs text-gray-400 line-through ml-1">S/ {product.originalPrice}</span>}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`font-medium ${product.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>{product.stock}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => setEditProduct(product)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                                  {deletingId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Pedidos</h2>
              <button onClick={loadOrders} className="text-sm text-coral hover:underline">Actualizar</button>
            </div>

            {loadingOrders ? (
              <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-coral" /></div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
                <ShoppingBag size={40} className="mx-auto mb-3 opacity-20" />
                <p>No hay pedidos aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">#{order.id.slice(-8).toUpperCase()}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[order.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                            {STATUS_LABELS[order.status]?.label || order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{order.customerEmail} · {order.customerPhone}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {order.delivery === 'home' ? `🚚 ${order.address}, ${order.district}` : '🏪 Recojo en tienda'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">S/ {order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('es-PE')}</p>
                        {NEXT_STATUS[order.status] && (
                          <button onClick={() => handleStatusAdvance(order.id, order.status)} disabled={statusUpdating === order.id}
                            className="mt-2 flex items-center gap-1.5 text-xs bg-coral/10 text-coral px-3 py-1.5 rounded-lg hover:bg-coral/20 transition-colors disabled:opacity-40">
                            {statusUpdating === order.id ? <Loader2 size={11} className="animate-spin" /> : <ChevronDown size={11} />}
                            Marcar como {STATUS_LABELS[NEXT_STATUS[order.status]]?.label}
                          </button>
                        )}
                      </div>
                    </div>
                    {order.items.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1">
                            <img src={item.product.image} alt={item.product.name} className="w-6 h-6 rounded object-cover" />
                            <span className="text-xs text-gray-600">{item.product.name} ×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product modal */}
      <AnimatePresence>
        {editProduct !== null && (
          <ProductModal
            product={editProduct === 'new' ? null : editProduct}
            onClose={() => setEditProduct(null)}
            onSave={() => { setEditProduct(null); loadProducts() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
