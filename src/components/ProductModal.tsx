/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Copy, Check, ArrowLeft } from "lucide-react";
import { Product } from "../types";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const hasDiscount = product.old_price && Number(product.old_price) > Number(product.new_price);

  // Pre-filled Telegram text template as requested
  const telegramMessage = `Здравствуйте!
Я хочу купить:
Название товара: ${product.title}
Цена: ${product.new_price} ₽`;

  const tgLink = `https://t.me/xygoep?text=${encodeURIComponent(telegramMessage)}`;

  const handleBuyClick = () => {
    window.open(tgLink, "_blank", "noopener,noreferrer");
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(telegramMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl min-h-screen sm:min-h-0 bg-[#0F0F0F] sm:rounded-[24px] border-t sm:border border-white/10 overflow-hidden flex flex-col shadow-[0_25px_50px_-12px_rgba(0,229,255,0.15)] z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад к каталогу</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Immersive Image Display with ambient blur background */}
            <div className="relative aspect-video sm:aspect-[16/10] w-full bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${product.image})` }}
              />
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="relative w-full h-full object-contain z-10"
              />
            </div>

            {/* Information Block */}
            <div className="space-y-4">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-none">
                {product.title}
              </h2>

              {/* Price Panel */}
              <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 w-fit">
                {hasDiscount && (
                  <span className="text-sm sm:text-base text-white/35 line-through">
                    {product.old_price} ₽
                  </span>
                )}
                <span className="font-display font-black text-2xl sm:text-3xl text-accent-green text-neon-green">
                  {product.new_price} ₽
                </span>
                {hasDiscount && (
                  <span className="text-[10px] px-2.5 py-1 bg-accent-green/20 text-accent-green border border-accent-green/30 rounded-full font-bold uppercase tracking-wider">
                    Скидка
                  </span>
                )}
              </div>

              {/* Long description */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-widest text-white/40 font-mono">
                  Описание товара
                </h4>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed whitespace-pre-wrap font-sans">
                  {product.description}
                </p>
              </div>
            </div>

          </div>

          {/* Action Footer Button */}
          <div className="p-4 sm:p-6 border-t border-white/5 bg-black/50 backdrop-blur-md">
            <button
              onClick={handleBuyClick}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-green hover:from-accent-green hover:to-accent-purple text-black font-display font-black text-lg tracking-wider uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,100,0.4)] transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 relative group overflow-hidden"
            >
              {/* Highlight flash animation */}
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              <Send className="w-5 h-5" />
              <span>КУПИТЬ В TELEGRAM</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
