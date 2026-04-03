"use client";

import { useState } from "react";
import MobileHeader from "./MobileHeader";
import MobileTabBar from "./MobileTabBar";
import MobileMenu from "./MobileMenu";

interface MobileNavWrapperProps {
  children: React.ReactNode;
}

export default function MobileNavWrapper({ children }: MobileNavWrapperProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <div className="desktop-header">
        {/* Will be filled by page level Header */}
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-header">
        <MobileHeader />
        <MobileTabBar onMenuOpen={() => setMenuOpen(true)} />
        <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </>
  );
}
