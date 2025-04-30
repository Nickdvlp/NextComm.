import React, { useEffect, useState } from "react";
import Hero from "../components/layout/Hero";
import GenderCollectionSection from "../components/products/GenderCollectionSection";
import NewArrivals from "../components/products/NewArrivals";
import ProductDetails from "../components/products/ProductDetails";
import ProductGrid from "../components/products/ProductGrid";
import FeatureCollection from "../components/products/FeatureCollection";
import FeaturedSection from "../components/products/FeaturedSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSeller, setBestSeller] = useState([]);
  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-sellers`
        );

        setBestSeller(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      {/* Best Seller */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSeller ? (
        <ProductDetails productId={bestSeller._id} />
      ) : (
        <p>Loading best seller product...</p>
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears For Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeatureCollection />
      <FeaturedSection />
    </div>
  );
};

export default Home;
