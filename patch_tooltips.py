import os
import re

planning_dir = r"C:\Users\PC\OneDrive - Hanoi University of Science and Technology\BrandFLow\frontend\src\app\planning"

# Mapping of column keys to their tooltip type
# source type for historical/factual data
# rationale type for strategies/proposals
key_mapping = {
    'source': 'source',
    'reason': 'source',
    'ratio': 'source',
    'sbu': 'source', 
    'issue': 'rationale',
    'decision': 'rationale',
    'action': 'rationale',
    'note': 'rationale',
    'item': 'rationale',
    'strategy': 'rationale',
    'tactic': 'rationale',
    'next': 'rationale',
    'name': 'rationale',
    'content': 'rationale',
    'opportunism_risk': 'rationale',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already imported RationaleTooltip
    if "RationaleTooltip" in content and "a4-market" not in filepath:
        # We might have already patched a2 and c2, skip them or just proceed
        # Let's skip them if they already have it to avoid double-importing
        print(f"Skipping (already patched): {filepath}")
        return

    original_content = content
    modified = False

    # Need to add import
    import_statement = "import { RationaleTooltip } from '@/components/ui/RationaleTooltip';\n"
    
    # 1. PastelTable files
    if "PastelTable" in content:
        # Find column definition
        for key, tooltip_type in key_mapping.items():
            # Look for: { key: 'xxx', header: '...', ... }
            pattern = r"(\{[\s]*key:\s*['\"]" + key + r"['\"].*?className:\s*['\"][^'\"]*['\"](?:.*?)\})"
            matches = re.finditer(pattern, content, re.DOTALL)
            
            for match in matches:
                full_col = match.group(0)
                if "render:" in full_col:
                    continue
                
                # Replace the closing brace with render function
                # First, remove the closing brace
                new_col = full_col[:-1].strip()
                if new_col.endswith(','):
                    new_col = new_col[:-1]
                
                render_func = f""",
      render: (row: any) => (
        <div className="flex items-center justify-between">
          <span>{{row.{key}}}</span>
          {{row.rationale && (
            <RationaleTooltip rationale={{row.rationale}} type="{tooltip_type}">
              <span className="sr-only">Why</span>
            </RationaleTooltip>
          )}}
        </div>
      )
    }}"""
                new_col += render_func
                content = content.replace(full_col, new_col)
                modified = True

    # 2. A4 Market (custom layout)
    if "a4-market" in filepath:
        # It's custom. I will just do it manually later or here.
        # Inside node mapping: <p className="text-sm ...">{node.opportunism_risk}</p>
        # Let's just find opportunism_risk and append tooltip
        pass

    if modified:
        # Add import after the last import
        import_match = list(re.finditer(r"^import .*?;", content, re.MULTILINE))
        if import_match:
            last_import = import_match[-1]
            insert_pos = last_import.end() + 1
            content = content[:insert_pos] + import_statement + content[insert_pos:]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched: {filepath}")

for root, dirs, files in os.walk(planning_dir):
    for file in files:
        if file == "page.tsx":
            process_file(os.path.join(root, file))

