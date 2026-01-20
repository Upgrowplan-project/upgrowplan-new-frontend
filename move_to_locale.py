#!/usr/bin/env python3
"""
Script to move all page.en.tsx/page.ru.tsx files into [locale] subdirectories
"""

import shutil
from pathlib import Path

# Paths that need to be moved into [locale]
routes = [
    ("app/about/page.en.tsx", "app/[locale]/about/page.en.tsx"),
    ("app/about/page.ru.tsx", "app/[locale]/about/page.ru.tsx"),
    ("app/account/page.en.tsx", "app/[locale]/account/page.en.tsx"),
    ("app/account/page.ru.tsx", "app/[locale]/account/page.ru.tsx"),
    ("app/auth/page.en.tsx", "app/[locale]/auth/page.en.tsx"),
    ("app/auth/page.ru.tsx", "app/[locale]/auth/page.ru.tsx"),
    ("app/blog/page.en.tsx", "app/[locale]/blog/page.en.tsx"),
    ("app/blog/page.ru.tsx", "app/[locale]/blog/page.ru.tsx"),
    ("app/contacts/page.en.tsx", "app/[locale]/contacts/page.en.tsx"),
    ("app/contacts/page.ru.tsx", "app/[locale]/contacts/page.ru.tsx"),
    ("app/privacy/page.en.tsx", "app/[locale]/privacy/page.en.tsx"),
    ("app/privacy/page.ru.tsx", "app/[locale]/privacy/page.ru.tsx"),
    ("app/products/page.en.tsx", "app/[locale]/products/page.en.tsx"),
    ("app/products/page.ru.tsx", "app/[locale]/products/page.ru.tsx"),
    ("app/solutions/page.en.tsx", "app/[locale]/solutions/page.en.tsx"),
    ("app/solutions/page.ru.tsx", "app/[locale]/solutions/page.ru.tsx"),
    ("app/fin-model/model1/page.en.tsx", "app/[locale]/fin-model/model1/page.en.tsx"),
    ("app/fin-model/model1/page.ru.tsx", "app/[locale]/fin-model/model1/page.ru.tsx"),
    ("app/solutions/marketResearch/page.en.tsx", "app/[locale]/solutions/marketResearch/page.en.tsx"),
    ("app/solutions/marketResearch/page.ru.tsx", "app/[locale]/solutions/marketResearch/page.ru.tsx"),
    ("app/solutions/openAbroad/page.en.tsx", "app/[locale]/solutions/openAbroad/page.en.tsx"),
    ("app/solutions/openAbroad/page.ru.tsx", "app/[locale]/solutions/openAbroad/page.ru.tsx"),
    ("app/solutions/plan/page.en.tsx", "app/[locale]/solutions/plan/page.en.tsx"),
    ("app/solutions/plan/page.ru.tsx", "app/[locale]/solutions/plan/page.ru.tsx"),
    ("app/solutions/socialPlanMaster/page.en.tsx", "app/[locale]/solutions/socialPlanMaster/page.en.tsx"),
    ("app/solutions/socialPlanMaster/page.ru.tsx", "app/[locale]/solutions/socialPlanMaster/page.ru.tsx"),
    ("app/solutions/synthFocusLab/page.en.tsx", "app/[locale]/solutions/synthFocusLab/page.en.tsx"),
    ("app/solutions/synthFocusLab/page.ru.tsx", "app/[locale]/solutions/synthFocusLab/page.ru.tsx"),
]

def main():
    moved = 0
    failed = 0
    
    for src, dst in routes:
        src_path = Path(src)
        dst_path = Path(dst)
        
        if src_path.exists():
            # Create destination directory
            dst_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Move file
            try:
                shutil.move(str(src_path), str(dst_path))
                print(f"✓ Moved {src} -> {dst}")
                moved += 1
            except Exception as e:
                print(f"✗ Error moving {src}: {e}")
                failed += 1
        else:
            print(f"- Skipping {src} (not found)")
    
    print(f"\n✓ Moved {moved} files")
    if failed:
        print(f"✗ Failed to move {failed} files")

if __name__ == "__main__":
    main()
