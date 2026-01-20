#!/usr/bin/env python3
"""
Script to migrate locale-specific pages using usePathname hook
"""

import os
from pathlib import Path

def create_locale_wrapper_with_hook(folder_path):
    """Create a page.tsx wrapper using usePathname hook"""
    
    en_file = Path(folder_path) / "page.en.tsx"
    ru_file = Path(folder_path) / "page.ru.tsx"
    wrapper_file = Path(folder_path) / "page.tsx"
    
    # Check if both files exist
    if en_file.exists() and ru_file.exists():
        wrapper_content = '''"use client";

import { usePathname } from "next/navigation";
import EnPage from "./page.en";
import RuPage from "./page.ru";

export default function Page() {
  const pathname = usePathname();
  const isRussian = pathname.startsWith("/ru");
  
  return isRussian ? <RuPage /> : <EnPage />;
}
'''
        with open(wrapper_file, 'w', encoding='utf-8') as f:
            f.write(wrapper_content)
        print(f"✓ Updated {wrapper_file}")
        return True
    return False

def main():
    target_folders = [
        "app/about",
        "app/account", 
        "app/auth",
        "app/blog",
        "app/contacts",
        "app/privacy",
        "app/products",
        "app/solutions",
        "app/solutions/marketResearch",
        "app/solutions/openAbroad",
        "app/solutions/plan",
        "app/solutions/socialPlanMaster",
        "app/solutions/synthFocusLab",
        "app/fin-model/model1",
    ]
    
    updated = 0
    
    for folder in target_folders:
        folder_path = Path(folder)
        if folder_path.exists():
            if create_locale_wrapper_with_hook(folder_path):
                updated += 1
    
    print(f"\n✓ Updated {updated} locale wrappers")

if __name__ == "__main__":
    main()
