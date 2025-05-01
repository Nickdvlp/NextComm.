import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/layout/UserLayout";
import AdminLayout from "./components/layout/AdminLayout";
import Home from "./pages/Home";
import { Bounce, ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/products/ProductDetails";
import Checkout from "./components/cart/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetails from "./pages/OrderDetails";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/admin/UserManagement";
import ProductManagement from "./components/admin/ProductManagement";
import EditProduct from "./components/admin/EditProduct";
import OrderManagement from "./components/admin/OrderManagement";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoutes from "./components/common/protectedRoutes";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoutes role="admin">
                <AdminLayout />
              </ProtectedRoutes>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
