import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X, ShoppingCart, Star, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProducts } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { products as mockProducts } from '@/mocks/products'
import type { Product, ProductCategory } from '@/models'

const CATEGORIES: ProductCategory[] = ['Todos', 'Café', 'Miel', 'Chocolates', 'Artesanías', 'Textiles', 'Gourmet']

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor calificados' },
  { value: 'name', label: 'Nombre A-Z' },
]

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const items = useCartStore(s => s.items)
  const [added, setAdded] = useState(false)

  const inCart = items.some(i => i.product.id === product.id)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-sand/30 flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {product.isNew && <span className="bg-coral text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NUEVO</span>}
          {product.isFeatured && <span className="bg-terracota text-white text-[10px] font-bold px-2 py-0.5 rounded-full">DESTACADO</span>}
          {product.originalPrice && <span className="bg-vino text-white text-[10px] font-bold px-2 py-0.5 rounded-full">OFERTA</span>}
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
            Últimas {product.stock} unidades
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-semibold text-sm px-3 py-1 rounded-full">Agotado</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-terracota font-medium mb-1">{product.category} · {product.region}</span>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{product.description}</p>

        <div className="flex items-center gap-1 mb-3">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">S/ {product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">S/ {product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              added
                ? 'bg-green-500 text-white'
                : inCart
                ? 'bg-coral/10 text-coral border border-coral'
                : 'bg-coral text-white hover:bg-terracota'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ShoppingCart size={13} />
            {added ? '¡Agregado!' : inCart ? 'En carrito' : 'Agregar'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory>('Todos')
  const [sort, setSort] = useState('createdAt')
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProducts({ category, search, sort })
      setProducts(data)
    } catch {
      // Fallback to mock data
      let filtered = mockProducts
      if (category !== 'Todos') filtered = filtered.filter(p => p.category === category)
      if (search) filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
      setProducts(filtered)
    } finally {
      setLoading(false)
    }
  }, [category, search, sort])

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  const filtered = products.filter(p => {
    if (minPrice && p.price < Number(minPrice)) return false
    if (maxPrice && p.price > Number(maxPrice)) return false
    return true
  })

  const totalItems = useCartStore(s => s.totalItems)()

  return (
    <div className="min-h-screen bg-sand/20">
      {/* Page header */}
      <div className="bg-white border-b border-sand/40 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tienda</h1>
              <p className="text-sm text-gray-500">Productos artesanales del Perú</p>
            </div>
            <a href="/carrito" className="relative flex items-center gap-2 bg-coral text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-terracota transition-colors">
              <ShoppingCart size={16} />
              Carrito
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-vino text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </a>
          </div>

          {/* Search + Sort row */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
              />
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 bg-white"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={15} />
              Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-56 shrink-0 space-y-6"
            >
              <div className="bg-white rounded-2xl p-4 border border-sand/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Categoría</h3>
                  <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        category === cat ? 'bg-coral text-white font-medium' : 'text-gray-600 hover:bg-sand/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-sand/30">
                <h3 className="font-semibold text-sm mb-3">Precio (S/)</h3>
                <div className="flex gap-2">
                  <input
                    type="number" placeholder="Mín" value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-coral/30"
                  />
                  <input
                    type="number" placeholder="Máx" value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-coral/30"
                  />
                </div>
                {(minPrice || maxPrice) && (
                  <button onClick={() => { setMinPrice(''); setMaxPrice('') }} className="text-xs text-coral mt-2 hover:underline">
                    Limpiar rango
                  </button>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Category chips */}
          <div className="flex gap-2 flex-wrap mb-5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-coral text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-coral hover:text-coral'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-sand/30 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Package size={48} className="mb-3 opacity-30" />
              <p className="text-lg font-medium">No encontramos productos</p>
              <p className="text-sm">Prueba con otros filtros</p>
              <button onClick={() => { setSearch(''); setCategory('Todos') }} className="mt-4 text-coral text-sm hover:underline">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-4">{filtered.length} productos</p>
              <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {filtered.map(product => <ProductCard key={product.id} product={product} />)}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
