/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Канал Роблокс",
    description: "Премиальное игровое сообщество с активной аудиторией и готовым доходом. Полный доступ.",
    old_price: "1200",
    new_price: "500",
    image: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=600&auto=format&fit=crop&q=80",
    category: "Каналы",
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
    visible: true,
    sequence: 1,
  },
  {
    id: "prod-2",
    title: "Донат 1000 Robux",
    description: "Мгновенное пополнение вашего аккаунта чистыми робуксами через систему Групп-трансфер.",
    old_price: "1000",
    new_price: "750",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    category: "Валюта",
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
    visible: true,
    sequence: 2,
  },
  {
    id: "prod-3",
    title: "Аккаунт Roblox [2018]",
    description: "Редкий олдскульный аккаунт 2018 года с лимитированными вещами, высоким уровнем в MM2 и Blox Fruits.",
    old_price: "",
    new_price: "1500",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    category: "Аккаунты",
    created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(), // 1 day ago
    visible: true,
    sequence: 3,
  },
  {
    id: "prod-4",
    title: "Скрипт на Blade Ball",
    description: "Приватный VIP чит-скрипт с функциями Auto-Parry, Target Lock и телепортацией. Без банов.",
    old_price: "600",
    new_price: "300",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
    category: "Скрипты",
    created_at: new Date().toISOString(),
    visible: true,
    sequence: 4,
  }
];
