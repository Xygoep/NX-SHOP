/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { EyeOff, ArrowUpRight } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  isAdmin: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, isAdmin }) => {
  const hasDiscount = product.old_price && Number(product.old_price) > Number(product.new_price);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="group relative cursor-pointer glass-panel rounded-[20px] overflow-hidden border border-white/5 p-2.5 sm:p-4 flex flex-col h-full hover:border-accent-green/25 hover:shadow-[0_10px_30px_rgba(0,255,100,0.15)] transition-all duration-300"
    >
      {/* Visibility Badge for Admin */}
      {!product.visible && isAdmin && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-md text-[10px] text-red-400 font-medium">
          <EyeOff className="w-3 h-3" />
          <span>Скрыт</span>
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full bg-neutral-900 rounded-[15px] mb-3 sm:mb-4 overflow-hidden group">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-accent-green text-neon-green text-xs font-semibold tracking-wider uppercase flex items-center gap-1">
            Подробнее <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Product Title */}
      <h3 className="font-display font-bold text-sm sm:text-base text-white tracking-wide group-hover:text-accent-green group-hover:text-neon-green transition-colors line-clamp-1 mb-1">
        {product.title}
      </h3>

      {/* Product Short Description (Truncated strictly to max 1 line with ...) */}
      <p className="text-xs text-white/50 mb-4 line-clamp-1 leading-relaxed">
        {product.description}
      </p>

      {/* Price Block and Buy Quick Accent */}
      <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          {hasDiscount && (
            <span className="text-[11px] sm:text-xs text-white/30 line-through">
              {product.old_price} ₽
            </span>
          )}
          <span className="font-display font-extrabold text-sm sm:text-lg text-accent-green text-neon-green">
            {product.new_price} ₽
          </span>
        </div>
        
        {/* Action Button Accent */}
        <div className="w-8 h-8 rounded-full bg-white/[0.03] group-hover:bg-accent-green/10 border border-white/10 group-hover:border-accent-green/30 flex items-center justify-center transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-accent-green transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
