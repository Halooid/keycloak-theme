import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo-no-background.svg';

const BrandSection: React.FC = () => {
  return (
    <div className="brand-section">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="brand-content"
      >
        <img src={logo} alt="HALOOID" className="brand-logo-large" />
        <h1 className="brand-tagline">
          Finally acquired <br /> 
          <span className="text-gradient" style={{ fontSize: '1.2em' }}>NeuroArc</span>
        </h1>
      </motion.div>
    </div>
  );
};

export default BrandSection;
