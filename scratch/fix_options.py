import os
import glob

# Files to update
files_to_update = [
    "src/pages/arm-calculator.astro",
    "src/pages/extra-payment-calculator.astro",
    "src/pages/how-much-can-i-afford.astro",
    "src/pages/investment-property-calculator.astro",
    "src/pages/refinance-calculator.astro"
]

for filepath in files_to_update:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the pair of 30 and 15 with 30, 20, 15, 10
        target = '<option value="30">30 Years</option>\n                <option value="15">15 Years</option>'
        replacement = '<option value="30">30 Years</option>\n                <option value="20">20 Years</option>\n                <option value="15">15 Years</option>\n                <option value="10">10 Years</option>'
        
        # Some files might have different indentation
        if target not in content:
            target2 = '<option value="30">30 Years</option>\n              <option value="15">15 Years</option>'
            replacement2 = '<option value="30">30 Years</option>\n              <option value="20">20 Years</option>\n              <option value="15">15 Years</option>\n              <option value="10">10 Years</option>'
            if target2 in content:
                content = content.replace(target2, replacement2)
        else:
            content = content.replace(target, replacement)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"Not found: {filepath}")

# Let's also check for bad link colors
print("\nScanning for hardcoded usa-blue text links...")
all_files = glob.glob('src/**/*.astro', recursive=True)
for f in all_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        if 'text-[var(--color-usa-blue)]' in content and '<a ' in content:
            print(f"Potential contrast issue in link: {f}")
        if 'text-blue-800' in content:
            print(f"text-blue-800 found in: {f}")
