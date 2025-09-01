import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

// Define variants with explicit types
const heroVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut"
    }
  }
};

const buttonVariants: Variants = {
  hover: { 
    scale: 1.05, 
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 flex flex-col items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?q=80&w=2070&auto=format')] bg-cover bg-center opacity-20"></div>
      
      {/* Main content */}
      <motion.div 
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 tracking-tight mb-6">
          Welcome to <span className="text-pink-600">Chic Salon</span>
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform your look with our expert stylists. Book your appointment today and experience luxury hair care tailored for you.
        </p>
        
        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div variants={buttonVariants} whileHover="hover">
            <Link 
              to="/register"
              className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-700 transition-colors duration-300"
            >
              Get Started
            </Link>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover">
            <Link 
              to="/login"
              className="inline-block bg-transparent border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-600 hover:text-white transition-colors duration-300"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative footer wave */}
      <div className="absolute bottom-0 w-full h-24 bg-pink-600 clip-path-wave"></div>
      
      {/* Standard CSS for wave effect */}
      <style>
        {`
          .clip-path-wave {
            clip-path: polygon(0 60%, 100% 0%, 100% 100%, 0% 100%);
          }
        `}
      </style>
    </div>
  );
}