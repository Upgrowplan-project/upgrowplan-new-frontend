#!/usr/bin/env python3
"""
Script to migrate locale-specific pages to use dynamic routing with [locale]
This creates page.tsx wrappers that select between page.en.tsx and page.ru.tsx
"""

import os
import re
from pathlib import Path

def create_locale_wrapper(folder_path):
    """Create a page.tsx wrapper for a folder with page.en.tsx and page.ru.tsx"""
    
    en_file = Path(folder_path) / "page.en.tsx"
    ru_file = Path(folder_path) / "page.ru.tsx"
    wrapper_file = Path(folder_path) / "page.tsx"
    
    # Check if both files exist and wrapper doesn't already exist
    if en_file.exists() and ru_file.exists() and not wrapper_file.exists():
        wrapper_content = '''\"use client\";

import EnPage from \"./page.en\";
import RuPage from \"./page.ru\";

export default function Page({
  params,
}: {
  params: { locale?: string };
}) {
  const locale = params?.locale || \"en\";
  return locale === \"ru\" ? <RuPage /> : <EnPage />;
}
'''
        with open(wrapper_file, 'w', encoding='utf-8') as f:
            f.write(wrapper_content)
        print(f"✓ Created {wrapper_file}")
        return True
    elif wrapper_file.exists():
        print(f"- Already exists: {wrapper_file}")
        return False
    else:
        if not en_file.exists():
            print(f"✗ Missing: {en_file}")
        if not ru_file.exists():
            print(f"✗ Missing: {ru_file}")
        return False

def main():
    app_dir = Path("app")
    
    # Folders that should have locale wrappers
    target_folders = [
        "app",
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
    
    created = 0
    skipped = 0
    
    for folder in target_folders:
        folder_path = Path(folder)
        if folder_path.exists():
            if create_locale_wrapper(folder_path):
                created += 1
            else:
                skipped += 1
        else:
            print(f"✗ Folder not found: {folder}")
    
    print(f"\n✓ Created {created} locale wrappers")
    print(f"- Skipped {skipped} (already exist or missing locale files)")

if __name__ == "__main__":
    main()
