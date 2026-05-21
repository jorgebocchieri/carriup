'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Cache de imágenes para evitar búsquedas repetidas
const imageCache: { [key: string]: string } = {}

async function getProductImage(productName: string): Promise<string> {
  if (imageCache[productName]) {
    return imageCache[productName]
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(productName)}&per_page=1&order_by=relevant&client_id=hTGHrZ7B5g6-D6J1OhOlH4J-KUuEfVCd-L_d8E5MoMQ`
    )
    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.small
      imageCache[productName] = imageUrl
      return imageUrl
    }
  } catch (err) {
    console.error('Error fetching image:', err)
  }

  return `https://images.unsplash.com/photo-1585521924905-c3400ca199e7?w=400&q=80`
}

interface Product {
  id: string
  name: string
  category: string
}

interface Variety {
  brand: string
  variety: string
  price: number
  supermarket: string
}

interface ProductDetails {
  id: string
  name: string
  category: string
  brands: string[]
  varieties: Variety[]
  imageUrl?: string
}

interface ProductWithImage extends Product {
  imageUrl?: string
}

interface ComparisonResult {
  supermarket: string
  total: number
  items: Array<{ name: string; price: number; brand: string }>
}

export default function ComparePage() {
  const [products, setProducts] = useState<ProductWithImage[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [cart, setCart] = useState<Array<{ id: string; name: string; quantity: number }>>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null)
  const [showQtyModal, setShowQtyModal] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedVariety, setSelectedVariety] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiExplanation, setAiExplanation] = useState('')

  useEffect(() => {
    fetchProducts('')
  }, [])

  async function fetchProducts(query: string) {
    try {
      const response = await axios.get(`${API_URL}/api/products/search?query=${query || 'a'}`)
      if (response.data.success) {
        const productsWithImages = await Promise.all(
          response.data.products.map(async (product: Product) => ({
            ...product,
            imageUrl: await getProductImage(product.name)
          }))
        )
        setProducts(productsWithImages)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    if (query.length > 0) {
      fetchProducts(query)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  async function selectProduct(product: ProductWithImage) {
    setSelectedProduct(product)
    setShowSearchResults(false)
    setModalLoading(true)
    setQuantity(1)
    setSelectedBrand('')
    setSelectedVariety('')

    try {
      const imageUrl = product.imageUrl || (await getProductImage(product.name))
      const response = await axios.get(`${API_URL}/api/products/details?id=${product.id}`)
      if (response.data.success) {
        setProductDetails({
          ...response.data.product,
          brands: response.data.brands,
          varieties: response.data.varieties,
          imageUrl,
        })
        setShowQtyModal(true)
      }
    } catch (err) {
      console.error('Error fetching product details:', err)
      setError('Error al cargar detalles del producto')
    } finally {
      setModalLoading(false)
    }
  }

  function confirmQty() {
    if (selectedProduct && quantity > 0) {
      const existing = cart.find(item => item.id === selectedProduct.id)
      if (existing) {
        setCart(cart.map(item =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ))
      } else {
        setCart([...cart, { id: selectedProduct.id, name: selectedProduct.name, quantity }])
      }
      setShowQtyModal(false)
      setSearchQuery('')
      setSelectedProduct(null)
    }
  }

  function removeFromCart(id: string) {
    setCart(cart.filter(item => item.id !== id))
  }

  function updateQuantity(id: string, qty: number) {
    if (qty > 0) {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: qty } : item
      ))
    }
  }

  async function generateWithAI() {
    if (!aiText.trim()) return
    setAiLoading(true)
    setAiExplanation('')
    setError('')
    try {
      const response = await axios.post(`${API_URL}/api/ai/generate-list`, { text: aiText })
      if (response.data.success && response.data.products.length > 0) {
        const newItems = response.data.products.map((p: Product) => ({
          id: p.id,
          name: p.name,
          quantity: 1,
        }))
        const merged = [...cart]
        newItems.forEach((item: { id: string; name: string; quantity: number }) => {
          if (!merged.find(c => c.id === item.id)) merged.push(item)
        })
        setCart(merged)
        setAiExplanation(response.data.explanation)
        setAiText('')
      } else {
        setError('No encontré productos para esa descripción')
      }
    } catch (err) {
      setError('Error conectando con la IA')
    } finally {
      setAiLoading(false)
    }
  }

  async function compare() {
    if (cart.length === 0) {
      setError('Agrega productos al carrito')
      return
    }

    setLoading(true)
    try {
      const productIds = cart.map(item => item.id).join(',')
      const response = await axios.get(`${API_URL}/api/prices/compare?products=${productIds}`)
      if (response.data.success) {
        setResults(response.data)
        setError('')
      } else {
        setError('Error al comparar precios')
      }
    } catch (err) {
      setError('Error conectando con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-indigo-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg">
                🛒
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                  Carriup
                </h1>
                <p className="text-xs text-gray-500">Comparador inteligente de precios</p>
              </div>
            </div>
            {cart.length > 0 && (
              <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
                {cart.length} producto{cart.length !== 1 ? 's' : ''} en carrito
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium animate-slide-in-down">
            ❌ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Search & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-lg p-6 animate-slide-in-up">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white font-bold text-lg">✨ Generar lista con IA</span>
              </div>
              <p className="text-indigo-200 text-sm mb-4">
                Describe lo que necesitas y Claude armará tu lista automáticamente
              </p>
              <textarea
                value={aiText}
                onChange={e => setAiText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateWithAI() } }}
                placeholder='Ej: "Desayuno para una semana" o "Ingredientes para hacer pasta"'
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-white/30 resize-none text-gray-800 placeholder-gray-400 mb-3"
              />
              <button
                onClick={generateWithAI}
                disabled={aiLoading || !aiText.trim()}
                className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <><span className="animate-spin">⟳</span> Generando...</>
                ) : (
                  <>✨ Generar lista</>
                )}
              </button>
              {aiExplanation && (
                <div className="mt-3 p-3 bg-white/20 rounded-xl text-white text-sm">
                  💡 {aiExplanation}
                </div>
              )}
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100/50 animate-slide-in-up">
              <label className="block mb-3">
                <span className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  🔍 Buscar productos
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej: Leche, Fideos, Café, Pollo..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                  autoComplete="off"
                />

                {/* Dropdown */}
                {showSearchResults && products.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-indigo-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50 animate-slide-in-down">
                    {products.map(product => (
                      <button
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className="w-full px-5 py-3 hover:bg-indigo-50 cursor-pointer text-left border-b border-gray-100 last:border-0 transition-colors flex gap-3 items-center"
                      >
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1585521924905-c3400ca199e7?w=400&q=80'
                            }}
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-800">{product.name}</div>
                          <div className="text-xs text-indigo-600">{product.category}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showSearchResults && products.length === 0 && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500 z-50">
                    Sin resultados para "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {results && (
              <div className="space-y-6 animate-slide-in-up">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Comparación de Precios</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.results.map((result: ComparisonResult) => {
                      const isBest = result.supermarket === results.bestSupermarket
                      return (
                        <div
                          key={result.supermarket}
                          className={`rounded-2xl p-5 transition-all duration-300 ${
                            isBest
                              ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 shadow-lg scale-105'
                              : 'bg-white border-2 border-gray-100 hover:shadow-lg'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg uppercase text-gray-900">{result.supermarket}</h3>
                            {isBest && <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">✓ MEJOR</span>}
                          </div>

                          <div className="space-y-2 mb-4 text-sm">
                            {result.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="font-semibold text-indigo-600">${item.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          <div className={`rounded-xl p-3 text-center ${isBest ? 'bg-white' : 'bg-gray-50'}`}>
                            <div className="text-xs text-gray-500 uppercase">Total</div>
                            <div className={`text-2xl font-bold ${isBest ? 'text-green-600' : 'text-indigo-600'}`}>
                              ${result.total.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                  <h3 className="text-lg font-bold mb-4">💰 Resumen de Comparación</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm opacity-90">Precio Mínimo</div>
                      <div className="text-2xl font-bold">${results.minTotal.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Precio Máximo</div>
                      <div className="text-2xl font-bold">${results.maxTotal.toLocaleString()}</div>
                    </div>
                    <div className="col-span-2 pt-4 border-t border-white/30">
                      <div className="text-sm opacity-90 mb-1">Ahorro Potencial</div>
                      <div className="text-3xl font-bold text-green-300">${results.savings.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/20 rounded-lg text-sm">
                    💡 Te recomendamos comprar en <strong>{results.bestSupermarket.toUpperCase()}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100/50 sticky top-24 animate-slide-in-up">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📦 Mi Carrito
                {cart.length > 0 && <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{cart.length}</span>}
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">Agrega productos para empezar</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="bg-gradient-to-r from-indigo-50 to-transparent p-3 rounded-lg border border-indigo-100">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-gray-800 capitalize">{item.name}</div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 text-lg transition"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="w-12 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-indigo-600"
                          />
                          <span className="text-xs text-gray-500">unidad{item.quantity > 1 ? 'es' : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={compare}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95"
                  >
                    {loading ? '⏳ Comparando...' : '🔍 Comparar Precios'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showQtyModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Selecciona opciones</h3>
              <button
                onClick={() => {
                  setShowQtyModal(false)
                  setProductDetails(null)
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {modalLoading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : productDetails && productDetails.varieties && productDetails.varieties.length > 0 ? (
              <div className="space-y-6">
                {/* Product Image */}
                {productDetails.imageUrl && (
                  <div className="rounded-xl overflow-hidden h-64 bg-gray-100">
                    <img
                      src={productDetails.imageUrl}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1585521924905-c3400ca199e7?w=400&q=80'
                      }}
                    />
                  </div>
                )}

                {/* Product Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                  <p className="text-sm text-indigo-600 uppercase font-semibold">{selectedProduct.category}</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedProduct.name}</p>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">🏷️ Selecciona Marca</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {productDetails.brands?.map(brand => (
                      <button
                        key={brand}
                        onClick={() => {
                          setSelectedBrand(brand)
                          setSelectedVariety('')
                        }}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          selectedBrand === brand
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Varieties */}
                {selectedBrand && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">📦 Variedades - {selectedBrand}</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {productDetails.varieties
                        .filter(v => v.brand === selectedBrand)
                        .map((variety, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedVariety(variety.variety)}
                            className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                              selectedVariety === variety.variety
                                ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-500 shadow-lg'
                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                            }`}
                          >
                            <div className="font-semibold text-gray-900">{variety.variety}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Desde ${variety.price.toLocaleString()} en {variety.supermarket}
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">📊 Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all text-lg font-semibold"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={confirmQty}
                    disabled={!selectedBrand || !selectedVariety}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg"
                  >
                    ✓ Agregar al Carrito
                  </button>
                  <button
                    onClick={() => {
                      setShowQtyModal(false)
                      setProductDetails(null)
                    }}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No hay variedades disponibles</p>
                <button
                  onClick={() => setShowQtyModal(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
