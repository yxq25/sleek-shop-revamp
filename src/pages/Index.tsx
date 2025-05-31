
import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { LoginModal } from '@/components/LoginModal';
import { Cart } from '@/components/Cart';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductCard } from '@/components/ProductCard';
import { AdminPanel } from '@/components/AdminPanel';
import { FloatingCartButton } from '@/components/FloatingCartButton';
import { AdminFooterPanel } from '@/components/AdminFooterPanel';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/store';

const Index = () => {
  const auth = useAuth();
  const store = useStore();
  const cart = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const matchesAgeFilter = (productAge: string, filterAge: string) => {
    if (!filterAge || filterAge === 'all') return true;
    
    const normalizeAge = (age: string) => {
      return age.toLowerCase()
        .replace(/años?/g, '')
        .replace(/año?/g, '')
        .replace(/meses?/g, 'm')
        .replace(/mes?/g, 'm')
        .replace(/\s+/g, '')
        .replace(/\+/g, '+');
    };

    const productAgeNorm = normalizeAge(productAge);
    const filterAgeNorm = normalizeAge(filterAge);

    if (productAgeNorm === filterAgeNorm) return true;

    const extractNumbers = (str: string) => {
      const matches = str.match(/\d+/g);
      return matches ? matches.map(Number) : [];
    };

    const productNumbers = extractNumbers(productAge);
    const filterNumbers = extractNumbers(filterAge);

    if (productNumbers.length === 0 || filterNumbers.length === 0) return false;

    if (productAge.includes('+')) {
      const productMin = productNumbers[0];
      const filterNum = filterNumbers[0];
      return filterNum >= productMin;
    }

    if (filterAge.includes('+')) {
      const filterMin = filterNumbers[0];
      const productNum = productNumbers[0];
      return productNum >= filterMin;
    }

    if (productNumbers.length >= 2 && filterNumbers.length >= 2) {
      const [prodMin, prodMax] = productNumbers;
      const [filtMin, filtMax] = filterNumbers;
      return !(prodMax < filtMin || prodMin > filtMax);
    }

    if (productNumbers.length === 1 && filterNumbers.length >= 2) {
      const prodNum = productNumbers[0];
      const [filtMin, filtMax] = filterNumbers;
      return prodNum >= filtMin && prodNum <= filtMax;
    }

    if (productNumbers.length >= 2 && filterNumbers.length === 1) {
      const [prodMin, prodMax] = productNumbers;
      const filtNum = filterNumbers[0];
      return filtNum >= prodMin && filtNum <= prodMax;
    }

    return false;
  };

  const filteredProducts = useMemo(() => {
    return store.products.filter(product => {
      if (!product.visible) return false;

      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCollection = !collectionFilter || collectionFilter === 'all' || product.collection === collectionFilter;
      const matchesAge = matchesAgeFilter(product.age, ageFilter);
      const matchesSkill = !skillFilter || skillFilter === 'all' || product.skills.some(skill => 
        skill.toLowerCase().includes(skillFilter.toLowerCase()));

      return matchesSearch && matchesCollection && matchesAge && matchesSkill;
    });
  }, [store.products, searchTerm, collectionFilter, ageFilter, skillFilter]);

  const handleAddToCart = (product: Product) => {
    cart.addToCart({
      id: product.id,
      name: product.name,
      price: product.price
    });
  };

  const handleCartButtonClick = () => {
    // Función para el botón flotante del carrito
    console.log('Cart button clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header 
        storeName={store.storeConfig.name}
        storeDescription={store.storeConfig.description}
        onAdminToggle={auth.toggleAdminMode}
        isAdminMode={auth.isAdminMode}
      />

      <FloatingCartButton 
        cart={cart.cart}
        onClick={handleCartButtonClick}
      />

      <AdminFooterPanel 
        isAdminMode={auth.isAdminMode}
        onAdminToggle={auth.toggleAdminMode}
      />

      <LoginModal
        open={auth.showLoginModal}
        onClose={() => auth.setShowLoginModal(false)}
        onLogin={auth.login}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con carrito */}
          <div className="lg:w-80 space-y-6">
            <Cart
              cart={cart.cart}
              total={cart.getTotal()}
              onRemoveItem={cart.removeFromCart}
              onCheckout={() => {}}
              storeConfig={store.storeConfig}
            />
          </div>

          {/* Contenido principal */}
          <div className="flex-1 space-y-8">
            {auth.isAdminMode && (
              <AdminPanel
                storeConfig={store.storeConfig}
                collections={store.collections}
                products={store.products}
                onUpdateStoreConfig={store.updateStoreConfig}
                onAddProduct={store.addProduct}
                onUpdateProduct={store.updateProduct}
                onDeleteProduct={store.deleteProduct}
                onToggleProductVisibility={store.toggleProductVisibility}
                onAddCollection={store.addCollection}
                onUpdateCollection={store.updateCollection}
                onDeleteCollection={store.deleteCollection}
              />
            )}

            <ProductFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              collectionFilter={collectionFilter}
              setCollectionFilter={setCollectionFilter}
              ageFilter={ageFilter}
              setAgeFilter={setAgeFilter}
              skillFilter={skillFilter}
              setSkillFilter={setSkillFilter}
              collections={store.collections}
              products={store.products}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-500">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
