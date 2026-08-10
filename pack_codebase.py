import os
import json
import sys
from typing import Dict, List, Set, Any

MEMO_FILE: str = ".llm_pack_memo.json"
OUTPUT_FILE: str = "codebase_context.md"

IGNORE_DIRS: Set[str] = {
    'node_modules', '.git', '.next', 'dist', 'build', '.turbo', 'coverage',
    '__pycache__', 'venv', '.venv'
}

IGNORE_EXTS: Set[str] = {
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.mp4', '.mp3', '.wav',
    '.zip', '.tar', '.gz', '.pdf', '.db', '.sqlite', '.sqlite3', '.exe',
    '.dll', '.class', '.pyc', '.log', '.lock', '.woff', '.woff2', '.ttf', '.eot'
}

def load_memo() -> Dict[str, bool]:
    if os.path.exists(MEMO_FILE):
        with open(MEMO_FILE, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                if isinstance(data, dict):
                    return {str(k): bool(v) for k, v in data.items()}
                return {}
            except json.JSONDecodeError:
                return {}
    return {}

def save_memo(memo: Dict[str, bool]) -> None:
    with open(MEMO_FILE, 'w', encoding='utf-8') as f:
        json.dump(memo, f, indent=2)

def main() -> None:
    if '--reset' in sys.argv:
        if os.path.exists(MEMO_FILE):
            os.remove(MEMO_FILE)
            print(f"Reset memo file ({MEMO_FILE}).")
            
    memo: Dict[str, bool] = load_memo()
    
    print("Scanning directory for files...")
    
    # Collect all valid files first
    all_files: List[str] = []
    for root, dirs, files in os.walk('.'):
        # Mutating dirs directly to skip ignored directories
        # Using a list copy and .clear()/.append() to satisfy strict type checkers
        original_dirs = list(dirs)
        dirs.clear()
        for d in original_dirs:
            if d not in IGNORE_DIRS:
                dirs.append(d)
        
        for filename in files:
            ext: str = str(os.path.splitext(filename)[1]).lower()
            if ext in IGNORE_EXTS:
                continue
            
            filepath = os.path.normpath(os.path.relpath(os.path.join(root, filename), '.')).replace('\\', '/')
                
            # Skip the script itself, the memo file, and the output file
            if filepath in [MEMO_FILE, OUTPUT_FILE, os.path.basename(__file__)]:
                continue
                
            all_files.append(filepath)

    # Sort files for consistent listing
    all_files.sort()

    # Clean up memo (remove deleted files)
    memo = {k: v for k, v in memo.items() if k in all_files}

    new_files: List[str] = [f for f in all_files if f not in memo]
    
    if new_files:
        print(f"Found {len(new_files)} new files. Please select whether to include them in the LLM context.")
        print("Press 'y' for Yes, 'n' for No, 's' to Skip directory, 'a' for Yes to All remaining, 'q' to Quit and generate with current selection.")
        
        auto_all: bool = False
        skip_dirs: Set[str] = set()
        
        for new_file in new_files:
            file_dir: str = os.path.dirname(new_file)
            
            if auto_all:
                memo[new_file] = True
                continue
                
            # Check if this file is in a directory we decided to skip
            should_skip: bool = False
            for sd in skip_dirs:
                if new_file.startswith(sd + '/') or new_file == sd:
                    memo[new_file] = False
                    should_skip = True
                    break
            
            if should_skip:
                continue
                
            while True:
                choice: str = input(f"Include {new_file}? [y/n/s/a/q]: ").strip().lower()
                if choice == 'y':
                    memo[new_file] = True
                    break
                elif choice == 'n':
                    memo[new_file] = False
                    break
                elif choice == 's':
                    skip_dirs.add(file_dir)
                    memo[new_file] = False
                    print(f"Skipping all remaining files in {file_dir}/ ...")
                    break
                elif choice == 'a':
                    auto_all = True
                    memo[new_file] = True
                    break
                elif choice == 'q':
                    print("Selection aborted. Will use current choices.")
                    save_memo(memo)
                    generate_context(memo)
                    return
                else:
                    print("Invalid choice. Please enter 'y', 'n', 's', 'a', or 'q'.")
    
    save_memo(memo)
    
    included_count: int = sum(1 for v in memo.values() if v)
    print(f"\nSelection complete. {included_count} out of {len(all_files)} total files selected for inclusion.")
    
    generate_context(memo)

def get_language_from_ext(ext: str) -> str:
    ext_map: Dict[str, str] = {
        '.ts': 'typescript',
        '.tsx': 'tsx',
        '.js': 'javascript',
        '.jsx': 'jsx',
        '.py': 'python',
        '.html': 'html',
        '.css': 'css',
        '.json': 'json',
        '.md': 'markdown',
        '.sh': 'bash',
        '.yml': 'yaml',
        '.yaml': 'yaml',
        '.sql': 'sql',
        '.go': 'go',
        '.rs': 'rust',
        '.java': 'java',
        '.c': 'c',
        '.cpp': 'cpp',
        '.h': 'c',
        '.hpp': 'cpp'
    }
    return ext_map.get(ext, '')

def generate_context(memo: Dict[str, bool]) -> None:
    if not any(memo.values()):
        print("No files were selected! Output file will not be generated.")
        return

    print(f"Generating {OUTPUT_FILE}...")
    
    included_files: List[str] = [f for f, included in memo.items() if included]
    included_files.sort()
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as out:
        out.write("# Codebase Context\n\n")
        out.write("This file contains the selected codebase context to be fed into an LLM.\n\n")
        
        out.write("## File Index\n\n")
        for f in included_files:
            out.write(f"- `{f}`\n")
        out.write("\n---\n\n")
        
        for included_file in included_files:
            if not os.path.exists(included_file):
                continue
                
            ext: str = str(os.path.splitext(included_file)[1]).lower()
            lang: str = get_language_from_ext(ext)
            
            out.write(f"## File: `{included_file}`\n\n")
            out.write(f"```{lang}\n")
            
            try:
                with open(included_file, 'r', encoding='utf-8') as infile:
                    content = infile.read()
                    out.write(content)
                    if not content.endswith('\n'):
                        out.write('\n')
            except Exception as e:
                out.write(f"// Error reading file: {e}\n")
                
            out.write("```\n\n")
            
    print(f"Done! Codebase context packed into -> {OUTPUT_FILE}")
    print(f"You can easily change your selections later by editing the {MEMO_FILE} file, or run the script again to pick up new files!")

if __name__ == "__main__":
    main()
