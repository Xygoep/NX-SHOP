/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { ShieldAlert, Sparkles, LogOut, Settings, HelpCircle, Heart, Eye } from "lucide-react";
import { Product } from "./types";
import { INITIAL_PRODUCTS } from "./initialProducts";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import AdminPanel from "./components/AdminPanel";
import SkeletonLoader from "./components/SkeletonLoader";

export default function App() {
  // Products storage in state synced to localStorage
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");

  // Routing and admin views
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  
  // Selected product to view details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Synchronize localStorage on mount
  useEffect(() => {
    // Check if products exist in localStorage
    const savedProducts = localStorage.getItem("nx_shop_products");
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to load products from local storage, using defaults", e);
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem("nx_shop_products", JSON.stringify(INITIAL_PRODUCTS));
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem("nx_shop_products", JSON.stringify(INITIAL_PRODUCTS));
    }

    // Check if initial route is admin
    const checkRoute = () => {
      const isPathAdmin =
        window.location.pathname === "/admin" ||
        window.location.hash === "#/admin" ||
        window.location.hash === "#admin";
      setIsAdminView(isPathAdmin);
    };

    checkRoute();
    window.addEventListener("hashchange", checkRoute);

    // Simulate luxury slow loading screen on initial mount for premium skeleton feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 850);

    return () => {
      window.removeEventListener("hashchange", checkRoute);
      clearTimeout(timer);
    };
  }, []);

  // Update products in localStorage whenever state changes
  const handleUpdateProducts = (newProducts: Product[]) => {
    // Sort products based on their sequence number before saving
    const sorted = [...newProducts].sort((a, b) => a.sequence - b.sequence);
    setProducts(sorted);
    localStorage.setItem("nx_shop_products", JSON.stringify(sorted));
  };

  // Check if admin is currently authenticated
  const isAdminAuthenticated = useMemo(() => {
    return localStorage.getItem("nx_shop_admin_authenticated") === "true";
  }, [isAdminView]);

  // Filter products immediately on client
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. If visible filter is off and user is not admin, hide invisible items
      if (!product.visible) {
        if (!isAdminAuthenticated) {
          return false;
        }
      }

      // 2. Search immediately across fields (title, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [products, searchQuery, isAdminAuthenticated]);

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery("");
  };

  // Handle Admin view navigation safely inside iframe
  const handleNavigateToAdmin = () => {
    setIsAdminView(true);
    window.location.hash = "#admin";
  };

  const handleNavigateToStore = () => {
    setIsAdminView(false);
    window.location.hash = "";
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white relative font-sans select-none flex flex-col justify-between">
      {/* Immersive background decoration spheres */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[60%] aspect-square bg-accent-purple/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] aspect-square bg-accent-green/5 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] right-[-10%] w-[35%] aspect-square bg-accent-green/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full flex-1">
        {isAdminView ? (
          // Admin Panel View
          <AdminPanel
            products={products}
            setProducts={handleUpdateProducts}
            onClose={handleNavigateToStore}
          />
        ) : (
          // Main Landing & Showcase View
          <div className="w-full max-w-4xl mx-auto px-4 md:px-6 pb-20">
            {/* Header / Brand & Google search input */}
            <Header
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAdminClick={handleNavigateToAdmin}
              isAdmin={isAdminAuthenticated}
            />

            {/* Catalog Grid / Showcase list */}
            <main className="w-full mt-8">
              {loading ? (
                // Shimmering Glass Skeleton
                <SkeletonLoader />
              ) : filteredProducts.length === 0 ? (
                // Empty search filter placeholder
                <div className="glass-panel p-16 rounded-[24px] border border-white/5 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center text-white/30">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Товары не найдены</h3>
                    <p className="text-sm text-white/40 mt-1 max-w-xs">
                      Попробуйте изменить поисковый запрос.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase transition hover:opacity-85 active:scale-95 cursor-pointer"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                // 2 Cards per row layout (strictly responsive: "Карточки располагаются по две в ряд.")
                <div className="grid grid-cols-2 gap-3.5 sm:gap-6 w-full">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isAdmin={isAdminAuthenticated}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Product Detail Immersive Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Footer Branding Area */}
      <footer className="relative z-10 w-full py-8 border-t border-white/5 bg-black/40 text-center text-xs text-white/30 px-4">
        <button
          onClick={isAdminView ? handleNavigateToStore : handleNavigateToAdmin}
          className="flex items-center justify-center gap-1 mx-auto hover:text-white transition-colors cursor-pointer group"
          title={isAdminAuthenticated ? "Панель админа" : "Вход для администратора"}
        >
          <span>© 2026</span>
          <span className="font-display font-bold text-white/50 group-hover:text-white transition-colors tracking-wider">NX SHOP</span>
        </button>
      </footer>
    </div>
  );
}
