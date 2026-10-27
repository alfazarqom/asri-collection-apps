import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext.tsx";
import { Header } from "./components/layout/Header.tsx";
import { BottomNav } from "./components/layout/BottomNav.tsx";
import { Footer } from "./components/layout/Footer.tsx";
import { CartDrawer } from "./components/cart/CartDrawer.tsx";
import { ToastContainer } from "./components/ui/Toast.tsx";

import { Home } from "./pages/Home.tsx";
import { Products } from "./pages/Products.tsx";
import { ProductDetails } from "./pages/ProductDetails.tsx";
import { Cart } from "./pages/Cart.tsx";
import { Orders } from "./pages/Orders.tsx";
import { About } from "./pages/About.tsx";
import { Contact } from "./pages/Contact.tsx";
import { PrivacyPolicy } from "./pages/PrivacyPolicy.tsx";
import { Terms } from "./pages/Terms.tsx";
import { ShippingPolicy } from "./pages/ShippingPolicy.tsx";
import { RefundPolicy } from "./pages/RefundPolicy.tsx";
import { PaymentPolicy } from "./pages/PaymentPolicy.tsx";
import { Admin } from "./pages/Admin.tsx";
import { NotFound } from "./pages/NotFound.tsx";

// Helper to scroll window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#9A3412] selection:text-white">
      {!isAdminRoute && <Header />}
      <main className="flex-1">
        <Routes>
          {/* Beranda */}
          <Route path="/" element={<Home />} />

          {/* Rute Ganda Katalog Busana */}
          <Route path="/products" element={<Products />} />
          <Route path="/produk" element={<Products />} />

          {/* Rute Ganda Detail Produk */}
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/produk/:id" element={<ProductDetails />} />

          {/* Rute Ganda Keranjang & Guest Checkout */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/keranjang" element={<Cart />} />

          {/* Rute Ganda Lacak Pesanan */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<Orders />} />
          <Route path="/pesanan" element={<Orders />} />
          <Route path="/pesanan/:id" element={<Orders />} />

          {/* Halaman Tentang Kami */}
          <Route path="/about" element={<About />} />
          <Route path="/tentang-kami" element={<About />} />

          {/* Halaman Kontak & Layanan Pelanggan */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/kontak" element={<Contact />} />

          {/* Halaman Kebijakan Privasi */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/kebijakan-privasi" element={<PrivacyPolicy />} />

          {/* Halaman Syarat dan Ketentuan */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/syarat-ketentuan" element={<Terms />} />

          {/* Halaman Kebijakan Pengiriman */}
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/kebijakan-pengiriman" element={<ShippingPolicy />} />

          {/* Halaman Kebijakan Pengembalian dan Refund */}
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/kebijakan-pengembalian" element={<RefundPolicy />} />

          {/* Halaman Informasi Pembayaran */}
          <Route path="/payment-policy" element={<PaymentPolicy />} />
          <Route path="/kebijakan-pembayaran" element={<PaymentPolicy />} />

          {/* Halaman Admin Backoffice (Terproteksi PIN 6 Digit) */}
          <Route path="/admin" element={<Admin />} />

          {/* Halaman 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BottomNav />}
      {!isAdminRoute && <CartDrawer />}
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
