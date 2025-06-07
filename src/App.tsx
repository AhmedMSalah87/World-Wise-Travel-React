import { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Loading from "./components/Loading";
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const PricingPage = lazy(() => import("@/pages/PricingPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const AppPage = lazy(() => import("@/pages/AppPage"));
const Cities = lazy(() => import("@/components/Cities"));
const CityInfo = lazy(() => import("@/components/CityInfo"));
const SearchCities = lazy(() => import("@/components/SearchCities"));
const Form = lazy(() => import("@/components/Form"));
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route
            path="app"
            element={
              <ProtectedRoute>
                <AppPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="cities" />} />
            <Route path="cities" element={<Cities />} />
            <Route path="cities/:id" element={<CityInfo />} />
            <Route path="search" element={<SearchCities />} />
            <Route path="form" element={<Form />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
