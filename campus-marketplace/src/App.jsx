import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EditProductPage from "./pages/EditProductPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AddProductPage from "./pages/AddProductPage";
import UserProfilePage from "./pages/UserProfilePage";
import MyListingsPage from "./pages/MyListingsPage";
import WishlistPage from "./pages/WishlistPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product/:productId" element={<EditProductPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          <Route path="/admin" element={<AdminDashboardPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />

      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
