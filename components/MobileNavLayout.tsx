"use client";

import { useState } from "react";
import MobileTabBar from "./MobileTabBar";
import MobileMenu from "./MobileMenu";

interface MobileNavLayoutProps {
  children: React.ReactNode;
}

/**
 * Wrapper для добавления мобильной навигации на любую страницу
 * Использование: <MobileNavLayout>{pageContent}</MobileNavLayout>
 */
export default function MobileNavLayout({ children }: MobileNavLayoutProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      {/* Mobile Navigation - Tab Bar + Menu only (Header is in page components) */}
      <div className="mobile-nav-overlay">
        <MobileTabBar onMenuOpen={() => setShowMobileMenu(true)} />
        <MobileMenu
          isOpen={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
        />
      </div>

      {/* Content */}
      {children}
    </>
  );
}
