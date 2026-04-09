import React from 'react';
import { motion } from 'framer-motion';

const StaggerGrid = ({ children, className = "" }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div
            className={className}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
        >
            {React.Children.map(children, (child) => {
                if (!child) return null;
                return (
                    <motion.div variants={item}>
                        {child}
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default StaggerGrid;
