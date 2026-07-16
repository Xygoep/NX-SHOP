/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  title: string;
  description: string;
  old_price?: string | number;
  new_price: string | number;
  image: string; // Base64 Data URL or remote image path
  category: string;
  created_at: string;
  visible: boolean;
  sequence: number; // For changing sorting order
}

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
}

export type CatalogFilter = {
  searchQuery: string;
  selectedCategory: string;
  showHidden: boolean; // Admin-only flag
};
