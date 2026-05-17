import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo-no-background.svg";

const Loading: React.FC = () => {
    return (
        <div className="loading-screen">
            <div className="bg-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="loading-centered-content">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="brand-content"
                    style={{ textAlign: "center" }}
                >
                    <img src={logo} alt="HALOOID" className="brand-logo-large" />
                    <h1 className="brand-tagline">
                        Finally acquired <br />
                        <span className="text-gradient" style={{ fontSize: "1.2em" }}>
                            NeuroArc
                        </span>
                    </h1>
                </motion.div>

                <div className="spinner-container" style={{ marginTop: "3rem" }}>
                    <motion.svg
                        viewBox="0 0 50 50"
                        className="loading-spinner"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="spinner-gradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                        <motion.circle
                            cx="25"
                            cy="25"
                            r="20"
                            stroke="url(#spinner-gradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0.2, rotate: 0 }}
                            animate={{
                                pathLength: [0.2, 0.8, 0.2],
                                rotate: [0, 360]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.svg>
                </div>
            </div>
        </div>
    );
};

export default Loading;
