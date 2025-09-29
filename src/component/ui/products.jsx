import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import spaImage from "../../assets/facialimg.png";
import GetProduct from "../../backend/getproduct/getproduct";
import GetProductImage from "../../backend/getproduct/getproductimage";
import { AlertCircle, ShoppingCart } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import SearchCard from "./searchcard";

const ProductScreen = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchServicesWithImages = async () => {
      try {
        setIsLoading(true);
        const products = await GetProduct();

        if (!products || products.length === 0) {
          setServices([]);
          setFilteredServices([]);
          return;
        }

        const productsWithImages = await Promise.all(
          products.map(async (product) => {
            try {
              const images = await GetProductImage(product.ProID);
              return {
                ...product,
                imageUrl: images.length > 0 ? images[0].productImage : spaImage,
              };
            } catch (err) {
              console.error(
                `Error fetching image for product ${product.ProID}:`,
                err
              );
              return { ...product, imageUrl: spaImage };
            }
          })
        );

        setServices(productsWithImages);
        setFilteredServices(productsWithImages);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicesWithImages();
  }, []);

  // Filter services based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchTerm, services]);

  const handleServiceClick = (service) => {
    navigate("/productmainpage", { state: { subService: service } });
  };

  // Skeleton card
  const SkeletonCard = () => (
    <Card className="flex flex-col h-[360px] rounded-lg shadow-lg border animate-pulse">
      <CardContent className="p-0 flex-grow">
        <div className="h-[200px] bg-gray-200 rounded-t-lg"></div>
      </CardContent>
      <div className="mt-3 px-4 py-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </Card>
  );

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="services"
      className="py-12 md:mt-6 bg-gradient-to-b from-blue-50 to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
        {/* Header + Search Card */}
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10 border-b border-gray-200">
          <div className="flex items-center justify-start p-3 sm:px-6">
            {/* <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600 hover:text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button> */}
            <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Products
            </h2>
          </div>
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="flex flex-row md:flex-row md:items-center justify-between mb-2 gap-3"
          >
            <div className="w-full md:w-1/3">
              <div className="w-[360px] md:w-[500px] mx-auto p-[10px]">
                <div className="flex items-center border border-gray-300 rounded-[5px] px-4 py-2 bg-white">
                  <FiSearch className="text-gray-400 mr-3" size={20} />
                  <input
                    type="text"
                    placeholder="Search for ‘salon’"
                    className="flex-grow outline-none text-gray-600 placeholder-gray-400 bg-transparent"
                  />
                </div>
              </div>
            </div>
            <motion.div
              className="w-full md:w-auto flex items-center gap-2 text-gray-800 hover:text-indigo-600 cursor-pointer transition-colors duration-200"
              onClick={() => navigate("/cartpage")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View cart"
            >
              <div className="flex flex-col items-center">
                <div className="items-center gap-1 border border-gray-500 p-2 rounded-full">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <span className="font-normal text-[9px]">Cart</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="pt-[100px]">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center mb-8 text-red-600 bg-red-50 p-4 rounded-lg shadow-sm"
            >
              <AlertCircle className="mr-2" size={24} />
              <span className="text-lg font-medium">{error}</span>
            </motion.div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {isLoading ? (
              Array(5)
                .fill()
                .map((_, index) => <SkeletonCard key={index} />)
            ) : filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <motion.div
                  key={service.ProID}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className="flex flex-col h-[360px] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-300 cursor-pointer group"
                    onClick={() => handleServiceClick(service)}
                    aria-label={`View ${service.ProductName} details`}
                  >
                    <CardContent className="p-0 flex-grow">
                      <div className="h-[200px] overflow-hidden rounded-t-lg">
                        <img
                          src={service.imageUrl || spaImage}
                          alt={service.ProductName || "Product"}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = spaImage;
                          }}
                        />
                      </div>
                    </CardContent>
                    <div className="px-4 py-4 flex flex-col flex-grow">
                      <span className="text-lg font-semibold text-gray-900 truncate block leading-tight mb-2">
                        {service.ProductName}
                      </span>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {service.ProductDes}
                      </p>
                      <span className="text-base font-medium text-gray-900 mt-auto">
                        ₹{Number(service.Price).toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-full text-center text-gray-600 py-12"
              >
                <p className="text-xl font-medium">
                  No products available at this time.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductScreen;
