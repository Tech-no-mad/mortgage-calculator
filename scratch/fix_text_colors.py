import glob

all_files = glob.glob('src/**/*.astro', recursive=True)
count = 0
for filepath in all_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace text-[var(--color-usa-blue)] that are not already followed by dark:text-blue-400
    # We will do this carefully. 
    # First, let's just replace all 'text-[var(--color-usa-blue)]' with a temporary marker,
    # then we'll clean up any double dark:text-blue-400.
    
    if 'text-[var(--color-usa-blue)]' in content:
        # Don't replace if it already has dark:text
        content = content.replace('text-[var(--color-usa-blue)] dark:text-blue-400', 'text-[var(--color-usa-blue)]')
        content = content.replace('text-[var(--color-usa-blue)]', 'text-[var(--color-usa-blue)] dark:text-blue-400')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f"Fixed blue text in {filepath}")

print(f"\nTotal files updated: {count}")
