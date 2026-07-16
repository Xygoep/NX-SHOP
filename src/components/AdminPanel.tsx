/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import {
  Lock,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  LogOut,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  FileText,
  TrendingUp,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { Product } from "../types";

// Base64 obfuscated credentials:
// "Xygoep" -> "WHlnb2Vw"
// "Xygoep2005" -> "WHlnb2VwMjAwNQ=="
const ADMIN_USER_B64 = "WHlnb2Vw";
const ADMIN_PASS_B64 = "WHlnb2VwMjAwNQ==";

interface AdminPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  onClose: () => void;
}

export default function AdminPanel({
  products,
  setProducts,
  onClose,
}: AdminPanelProps) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("nx_shop_admin_authenticated") === "true";
  });
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctUser = atob(ADMIN_USER_B64);
    const correctPass = atob(ADMIN_PASS_B64);

    if (login === correctUser && password === correctPass) {
      setIsAuthenticated(true);
      localStorage.setItem("nx_shop_admin_authenticated", "true");
      setAuthError("");
      showToast("Успешный вход в панель!", "success");
    } else {
      setAuthError("Неверный логин или пароль!");
      showToast("Ошибка авторизации", "error");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("nx_shop_admin_authenticated");
    showToast("Вы вышли из системы", "success");
  };

  // Helper Toast
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Create or Update Product Form Submission
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.new_price || !editingProduct?.image) {
      showToast("Заполните обязательные поля: Фото, Название и Новая цена!", "error");
      return;
    }

    const priceNum = Number(editingProduct.new_price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("Новая цена должна быть положительным числом!", "error");
      return;
    }

    const updatedProducts = [...products];

    if (editingProduct.id) {
      // Edit existing product
      const idx = updatedProducts.findIndex((p) => p.id === editingProduct.id);
      if (idx !== -1) {
        updatedProducts[idx] = {
          ...updatedProducts[idx],
          title: editingProduct.title,
          description: editingProduct.description || "",
          old_price: editingProduct.old_price ? String(editingProduct.old_price) : "",
          new_price: String(editingProduct.new_price),
          image: editingProduct.image,
          category: editingProduct.category || "Общее",
          visible: editingProduct.visible ?? true,
        };
        showToast("Товар успешно сохранен!", "success");
      }
    } else {
      // Add new product
      const maxSequence = products.reduce((max, p) => (p.sequence > max ? p.sequence : max), 0);
      const newProd: Product = {
        id: "prod-" + Date.now(),
        title: editingProduct.title,
        description: editingProduct.description || "",
        old_price: editingProduct.old_price ? String(editingProduct.old_price) : "",
        new_price: String(editingProduct.new_price),
        image: editingProduct.image,
        category: editingProduct.category || "Общее",
        created_at: new Date().toISOString(),
        visible: editingProduct.visible ?? true,
        sequence: maxSequence + 1,
      };
      updatedProducts.push(newProd);
      showToast("Новый товар успешно добавлен!", "success");
    }

    setProducts(updatedProducts);
    setIsEditing(false);
    setEditingProduct(null);
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      showToast("Товар успешно удален!", "success");
    }
  };

  // Toggle Visibility
  const toggleVisibility = (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const nextVisible = !p.visible;
        showToast(nextVisible ? "Товар теперь виден всем" : "Товар скрыт от клиентов", "success");
        return { ...p, visible: nextVisible };
      }
      return p;
    });
    setProducts(updated);
  };

  // Reordering Sequence: Move Up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    // Resave fresh sequences based on index
    const sequenced = updated.map((p, idx) => ({ ...p, sequence: idx + 1 }));
    setProducts(sequenced);
    showToast("Порядок товаров изменен!", "success");
  };

  // Reordering Sequence: Move Down
  const moveDown = (index: number) => {
    if (index === products.length - 1) return;
    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    // Resave fresh sequences
    const sequenced = updated.map((p, idx) => ({ ...p, sequence: idx + 1 }));
    setProducts(sequenced);
    showToast("Порядок товаров изменен!", "success");
  };

  // Image upload handler reading file as base64 data URL
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Изображение слишком большое! Максимум 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEditingProduct((prev) => ({ ...prev, image: reader.result as string }));
          showToast("Фото успешно загружено!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-[24px] border border-white/10 relative overflow-hidden">
          {/* Subtle glowing spheres */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-purple/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-green/10 rounded-full blur-2xl" />

          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-purple to-accent-green flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(0,255,100,0.2)]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">
              Панель управления
            </h2>
            <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-mono">
              Вход для администратора
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            {authError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-mono">
                Логин
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:border-accent-green/50 focus:outline-none focus:ring-1 focus:ring-accent-green/50 transition-all"
                placeholder="••••••"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-mono">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:border-accent-green/50 focus:outline-none focus:ring-1 focus:ring-accent-green/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-green hover:from-accent-green hover:to-accent-purple text-white font-display font-extrabold text-sm tracking-wide uppercase transition hover:shadow-[0_0_20px_rgba(0,255,100,0.35)] transform active:scale-95 cursor-pointer mt-2"
            >
              Войти
            </button>
          </form>

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-white/40 hover:text-white transition-colors mt-6 block cursor-pointer"
          >
            ← Назад к покупкам
          </button>
        </div>

        {/* Global Mini Toast notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border border-white/10 flex items-center gap-2.5 backdrop-blur-md glass-panel text-sm animate-bounce">
            <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-accent-green" : "bg-red-500"}`} />
            <span className="text-white font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  // Dashboard calculations for premium statistics panels
  const totalItems = products.length;
  const activeItems = products.filter((p) => p.visible).length;
  const hiddenItems = totalItems - activeItems;
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8 relative z-10">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border border-white/10 flex items-center gap-2.5 backdrop-blur-md glass-panel text-sm">
          <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-accent-green" : "bg-red-500"}`} />
          <span className="text-white font-medium">{toast.message}</span>
        </div>
      )}

      {/* Admin Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-accent-cyan" />
            <span>Панель управления</span>
          </h2>
          <p className="text-xs text-white/40 uppercase tracking-widest font-mono mt-1">
            NX Shop • Администрирование каталога
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => {
              setEditingProduct({ visible: true, category: "Общее" });
              setIsEditing(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-accent-green text-black font-semibold text-xs tracking-wide transition flex items-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить товар</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 transition cursor-pointer"
            title="Выйти"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5 relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-1">
            <ShoppingBag className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Всего товаров</p>
          <p className="text-2xl font-black text-white">{totalItems}</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5 relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center text-accent-green mb-1">
            <Eye className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Активные</p>
          <p className="text-2xl font-black text-white">{activeItems}</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-1.5 relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 mb-1">
            <EyeOff className="w-4.5 h-4.5" />
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Скрытые</p>
          <p className="text-2xl font-black text-white">{hiddenItems}</p>
        </div>
      </div>

      {/* Main Form Overlay Editor Modal */}
      {isEditing && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-xl bg-[#0F0F0F] rounded-[24px] border border-white/10 p-6 sm:p-8 overflow-hidden z-10 shadow-2xl">
            <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-cyan" />
              <span>{editingProduct.id ? "Редактировать товар" : "Новый товар"}</span>
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-mono">
                  Изображение товара * (загрузка с устройства)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {editingProduct.image ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black group">
                    <img
                      src={editingProduct.image}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="px-3.5 py-2 rounded-lg bg-white text-black font-semibold text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" /> Изменить
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-full aspect-[16/9] rounded-xl border border-dashed border-white/10 hover:border-accent-cyan/40 bg-white/[0.01] hover:bg-white/[0.03] transition flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <div className="p-3 bg-white/[0.03] rounded-full text-white/40">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-white/60">Нажмите для выбора фото с вашего устройства</span>
                    <span className="text-[10px] text-white/30 font-mono">Максимум 2MB, формат PNG/JPG</span>
                  </button>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-mono">
                  Название товара *
                </label>
                <input
                  type="text"
                  value={editingProduct.title || ""}
                  onChange={(e) => setEditingProduct((p) => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="Например: Канал Роблокс"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/50"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-mono">
                  Полное описание товара
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Опишите характеристики, уровень, бонусы, способы передачи..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Old Price */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-mono">
                    Старая цена (₽)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.old_price || ""}
                    onChange={(e) => setEditingProduct((p) => ({ ...p, old_price: e.target.value }))}
                    placeholder="Например: 1200"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/50"
                  />
                </div>

                {/* New Price */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-mono">
                    Новая цена (₽) *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.new_price || ""}
                    onChange={(e) => setEditingProduct((p) => ({ ...p, new_price: e.target.value }))}
                    required
                    placeholder="Например: 500"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-sm focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/50"
                  />
                </div>
              </div>

              {/* Visibility Toggle */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-1.5 font-mono">
                  Отображение
                </label>
                <select
                  value={editingProduct.visible === false ? "false" : "true"}
                  onChange={(e) => setEditingProduct((p) => ({ ...p, visible: e.target.value === "true" }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:border-accent-cyan/50 focus:outline-none"
                >
                  <option value="true">Виден на сайте</option>
                  <option value="false">Скрыт с сайта</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white font-semibold text-xs tracking-wide uppercase transition hover:bg-white/5 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-accent-green text-black font-display font-black text-xs tracking-wide uppercase transition hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] cursor-pointer"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Admin Product Catalog list */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/5 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h4 className="font-display font-semibold text-lg text-white">Список товаров в базе</h4>
          <span className="text-xs text-white/40 font-mono">
            {totalItems} записей • Порядок вывода соответствует положению в списке
          </span>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center text-white/30 space-y-2">
            <ImageIcon className="w-12 h-12 mx-auto opacity-20" />
            <p className="font-medium text-sm">Ваш магазин пуст</p>
            <p className="text-xs">Нажмите «Добавить товар» выше, чтобы наполнить витрину.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.01] text-[10px] uppercase tracking-widest text-white/45 font-mono border-b border-white/5">
                  <th className="p-4 w-16">Порядок</th>
                  <th className="p-4">Фото</th>
                  <th className="p-4">Название</th>
                  <th className="p-4">Старая / Новая цена</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4 text-right w-44">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {products.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-white/[0.02] transition-colors ${!p.visible ? "bg-white/[0.01] opacity-75" : ""}`}
                  >
                    {/* Index & Sort Arrows */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-white/30 w-4">{idx + 1}</span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            disabled={idx === 0}
                            onClick={() => moveUp(idx)}
                            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 transition"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === products.length - 1}
                            onClick={() => moveDown(idx)}
                            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 transition"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Image Thumbnail */}
                    <td className="p-4">
                      <div className="w-12 h-9 rounded-md bg-black/60 overflow-hidden border border-white/10">
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="p-4">
                      <div className="font-bold text-white max-w-xs truncate">{p.title}</div>
                    </td>

                    {/* Pricing */}
                    <td className="p-4 font-mono">
                      {p.old_price ? (
                        <span className="text-white/40 line-through mr-2.5 text-xs">
                          {p.old_price} ₽
                        </span>
                      ) : (
                        <span className="text-white/20 mr-2.5 text-xs">-</span>
                      )}
                      <span className="text-accent-green font-extrabold">{p.new_price} ₽</span>
                    </td>

                    {/* Visible toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => toggleVisibility(p.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer border transition-colors ${
                          p.visible
                            ? "bg-accent-green/10 text-accent-green border-accent-green/20 hover:bg-accent-green/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        }`}
                      >
                        {p.visible ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Активен</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Скрыт</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsEditing(true);
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-accent-cyan/15 hover:text-accent-cyan border border-white/5 transition cursor-pointer"
                          title="Редактировать"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/25 hover:text-red-400 border border-white/5 transition cursor-pointer"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/30 text-xs text-white/50 hover:text-white transition cursor-pointer"
        >
          ← Вернуться на витрину сайта
        </button>
      </div>
    </div>
  );
}
