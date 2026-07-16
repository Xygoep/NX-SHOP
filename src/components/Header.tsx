/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, X, ShieldAlert } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAdminClick: () => void;
  isAdmin: boolean;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  onAdminClick,
  isAdmin,
}: HeaderProps) {
  return (
    <header className="w-full pt-8 pb-4 px-4 flex flex-col items-center relative z-10">
      {/* Top Admin Banner */}
      {isAdmin && (
        <div className="w-full max-w-lg mb-6 flex items-center justify-center p-3 rounded-xl border border-accent-purple/30 bg-accent-purple/10 backdrop-blur-md text-xs">
          <div className="flex items-center gap-2 text-accent-purple font-medium">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>Вы вошли как Администратор</span>
          </div>
        </div>
      )}

      {/* Main Logo */}
      <div className="text-center mb-8 select-none relative group">
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-accent-purple via-accent-green to-accent-green opacity-30 blur-xl group-hover:opacity-50 transition duration-1000"></div>
        <h1 className="relative font-display text-5xl sm:text-6xl font-extrabold tracking-wider text-white">
          NX <span className="text-accent-green text-neon-green">SHOP</span>
        </h1>
      </div>

      {/* Search Input (Google Style with Glassmorphism) */}
      <div className="w-full max-w-lg relative group mb-6">
        <div className="absolute inset-0 -m-0.5 rounded-full bg-gradient-to-r from-accent-purple/20 to-accent-green/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-white/30 group-focus-within:text-accent-green group-focus-within:text-neon-green transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск товара..."
            className="w-full pl-12 pr-12 py-3.5 rounded-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 group-focus-within:border-accent-green/50 text-white placeholder-white/30 text-sm focus:outline-none transition-all duration-300 font-sans tracking-wide shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </header>
  );
}
