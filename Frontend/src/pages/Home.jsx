import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import BrandSlide from "../components/LandingPage/BrandSlide";
import CTA from "../components/LandingPage/CTA";
import Footer from "../components/LandingPage/Footer";
import Header from "../components/LandingPage/Header";
import Hero from "../components/LandingPage/Hero";
import Pricing from "../components/LandingPage/Pricing";
import ProductCard from "../components/LandingPage/ProductCard";
import ProductShowcase from "../components/LandingPage/ProductShowcase";
import Testimonials from "../components/LandingPage/Testimonials";
import '../Home.css'

const App = () => {
  return (
    <>
      <div className={twMerge("font-dm-sans", "antialiased")}>
        <div className="bg-black text-white p-3 text-sm text-center cursor-pointer">
          <span className="hidden sm:inline pr-2 opacity-80">
            Streamline your workflow and boost your productivity.
          </span>
          <span className="pr-1">
            Get started for free <FaArrowRight className="inline h-2 w-2" />
          </span>
        </div>
        <div>
      <Header />
      <Hero/>
      <BrandSlide/>
      <ProductShowcase/>
      <ProductCard/>
      <Pricing/>
      <Testimonials/>
      <CTA/>
      <Footer/>
    </div>
      </div>
    </>
  )
}

export default App