import os
import glob

all_files = glob.glob('src/**/*.astro', recursive=True)
count = 0
for filepath in all_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace hyperlink classes
    target = 'class="text-[var(--color-usa-blue)] hover:underline"'
    replacement = 'class="text-blue-600 dark:text-blue-400 hover:underline"'
    
    if target in content:
        content = content.replace(target, replacement)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f"Fixed links in {filepath}")
    
    # Check for other variations like text-[var(--color-usa-blue)] inside class=""
    # e.g., class="... text-[var(--color-usa-blue)] hover:underline"
    # To be safer, let's just replace `text-[var(--color-usa-blue)] hover:underline` without the `class="` part
    # in case there are multiple classes.
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    target2 = 'text-[var(--color-usa-blue)] hover:underline'
    replacement2 = 'text-blue-600 dark:text-blue-400 hover:underline'
    
    if target2 in content:
        content = content.replace(target2, replacement2)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f"Fixed links in {filepath}")

print(f"\nTotal files updated: {count}")
