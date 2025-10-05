import React, { Suspense, lazy } from "react";
import Navigation from "../component/Navigation";
import HeroSection from "../component/HeroSection";
import PromoCard from "../component/PromocardSection";
import ServicesCarousel2 from "../component/ServicesCarousel2";
import ServicesCarousel4 from "../component/ServicesCarousel4";
import BecomeWePretiffyCard from "../component/ui/becomeweprettifycard";
import SpecialForYou from "../component/ui/specialyforyou";
import Footer from "../component/Footer";
import RatingScreen from "../component/ui/ratingscreen";

const LazyServicesCarousel2 = lazy(() =>
  import("../component/ServicesCarousel2")
);
const LazyServicesCarousel4 = lazy(() =>
  import("../component/ServicesCarousel4")
);
const LazyBecomeWePretiffyCard = lazy(() =>
  import("../component/ui/becomeweprettifycard")
);
const LazySpecialForYou = lazy(() => import("../component/ui/specialyforyou"));

const Index = () => {
  // Dummy review data
  const dummyReviews = [
    {
      ID: 1,
      Name: "Vishal Gupta",
      Rating: "4.5",
      Review: "Great product! The quality exceeded my expectations.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      ID: 2,
      Name: "Ananya Sharma",
      Rating: "5",
      Review: "Absolutely loved it. Highly recommend to others!",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      ID: 3,
      Name: "Rahul Verma",
      Rating: "3.5",
      Review: "It’s decent but could be improved in packaging.",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      ID: 4,
      Name: "Priya Singh",
      Rating: "4",
      Review: "Very useful and affordable. Will buy again.",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      ID: 5,
      Name: "Aman Yadav",
      Rating: "2.5",
      Review: "Not satisfied, the product didn’t match the description.",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-white">
        <HeroSection />
      </section>

      {/* Promotions Section */}
      <section className="bg-white">
        <div className="">
          <PromoCard />
        </div>
      </section>

      {/* Services Section */}
      <section
        className="py-1 sm:py-16 bg-gray-50"
        aria-labelledby="services-heading"
      >
        <div className="">
          <Suspense fallback={<div className="" />}>
            <LazyServicesCarousel2 />
            <div className="">
              <LazyServicesCarousel4 />
            </div>
          </Suspense>
        </div>
      </section>

      <section className="bg-white">
        <div className="">
          <RatingScreen reviews={dummyReviews} />
        </div>
      </section>

      {/* Become WePretiffy Vendor Section */}
      <section
        className="py-1 sm:py-16 bg-pink-50"
        aria-labelledby="vendor-heading"
      >
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
            }
          >
            <LazyBecomeWePretiffyCard />
          </Suspense>
        </div>
      </section>
      <footer className="mt-8 bg-gray-100 z-10 md:hidden">
        <Footer />
      </footer>
    </div>
  );
};

export default Index;
