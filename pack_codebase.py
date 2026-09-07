import os
import json
import sys
import re
from typing import Dict, List, Set

MEMO_FILE: str = ".llm_pack_memo.json"
CODE_OUTPUT_FILE: str = "codebase_context.md"
DOCS_OUTPUT_FILE: str = "docs_context.md"

IGNORE_DIRS: Set[str] = {
    'node_modules', '.git', '.next', 'dist', 'build', '.turbo', 'coverage',
    '__pycache__', 'venv', '.venv'
}

IGNORE_EXTS: Set[str] = {
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.mp4', '.mp3', '.wav',
    '.zip', '.tar', '.gz', '.pdf', '.db', '.sqlite', '.sqlite3', '.exe',
    '.dll', '.class', '.pyc', '.log', '.lock', '.woff', '.woff2', '.ttf', '.eot'
}

DOC_EXTS: Set[str] = {
    '.md', '.markdown', '.rst', '.txt', '.adoc'
}

DOC_DIR_KEYWORDS: Set[str] = {
    'doc', 'docs', 'documentation', 'spec', 'specs', 'guide', 'guides', 'wiki'
}

def load_memo() -> Dict[str, str]:
    """
    Loads and automatically migrates old boolean memo files to the new category format:
    'code', 'doc', or 'ignore'
    """
    if os.path.exists(MEMO_FILE):
        with open(MEMO_FILE, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                if isinstance(data, dict):
                    migrated: Dict[str, str] = {}
                    for k, v in data.items():
                        if isinstance(v, bool):
                            migrated[str(k)] = "code" if v else "ignore"
                        elif isinstance(v, str):
                            val = v.lower()
                            migrated[str(k)] = val if val in {"code", "doc", "ignore"} else "ignore"
                    return migrated
                return {}
            except json.JSONDecodeError:
                return {}
    return {}

def save_memo(memo: Dict[str, str]) -> None:
    with open(MEMO_FILE, 'w', encoding='utf-8') as f:
        json.dump(memo, f, indent=2)

def suggest_category(filepath: str) -> str:
    """Heuristic to suggest whether a file is documentation or code."""
    ext: str = str(os.path.splitext(filepath)[1]).lower()
    path_parts: List[str] = [p.lower() for p in filepath.split('/')]
    
    if ext in DOC_EXTS or any(kw in path_parts for kw in DOC_DIR_KEYWORDS):
        return "doc"
    return "code"

def is_in_skipped_dir(filepath: str, skip_dirs: Set[str]) -> bool:
    file_dir = os.path.dirname(filepath)
    for sd in skip_dirs:
        if sd == "" and file_dir == "":
            return True
        if sd != "" and (filepath.startswith(sd + '/') or file_dir == sd):
            return True
    return False

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
        '.markdown': 'markdown',
        '.rst': 'rst',
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

def get_fence(content: str) -> str:
    """Finds the longest run of backticks and creates a fence that won't collide."""
    runs = re.findall(r'`+', content)
    max_len = max([len(r) for r in runs], default=0)
    return '`' * max(3, max_len + 1)

def generate_bundle(files: List[str], output_file: str, title: str, description: str) -> None:
    if not files:
        print(f"ℹ️  No files selected for {output_file}. Skipping generation.")
        return

    print(f"Generating {output_file} ({len(files)} files)...")
    files.sort()

    excluded_self = [MEMO_FILE, CODE_OUTPUT_FILE, DOCS_OUTPUT_FILE, os.path.basename(__file__)]

    with open(output_file, 'w', encoding='utf-8') as out:
        out.write(f"# {title}\n\n")
        out.write(f"{description}\n\n")
        
        out.write("## File Index\n\n")
        for f in files:
            out.write(f"- `{f}`\n")
        out.write("\n---\n\n")
        
        for file_path in files:
            if not os.path.exists(file_path) or file_path in excluded_self:
                continue
                
            ext: str = str(os.path.splitext(file_path)[1]).lower()
            lang: str = get_language_from_ext(ext)
            
            out.write(f"## File: `{file_path}`\n\n")
            
            try:
                with open(file_path, 'r', encoding='utf-8') as infile:
                    content = infile.read()
                    fence = get_fence(content)
                    out.write(f"{fence}{lang}\n")
                    out.write(content)
                    if not content.endswith('\n'):
                        out.write('\n')
                    out.write(f"{fence}\n\n")
            except Exception as e:
                out.write(f"```\n// Error reading file: {e}\n```\n\n")
                
    print(f"✅ Saved -> {output_file}")

def main() -> None:
    if '--reset' in sys.argv:
        if os.path.exists(MEMO_FILE):
            os.remove(MEMO_FILE)
            print(f"Reset memo file ({MEMO_FILE}).")
            
    memo: Dict[str, str] = load_memo()
    
    print("Scanning directory for files...")
    
    all_files: List[str] = []
    for root, dirs, files in os.walk('.'):
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
                
            # Skip generated outputs and the script itself
            if filepath in [MEMO_FILE, CODE_OUTPUT_FILE, DOCS_OUTPUT_FILE, os.path.basename(__file__)]:
                continue
                
            all_files.append(filepath)

    all_files.sort()

    # Prune files that were deleted from disk
    memo = {k: v for k, v in memo.items() if k in all_files}

    new_files: List[str] = [f for f in all_files if f not in memo]
    
    if new_files:
        print(f"\nFound {len(new_files)} new files.")
        print("Options: [c] Code | [d] Docs | [n] Ignore | [s] Skip directory | [a] Accept all suggested | [q] Quit\n")
        
        auto_accept_all: bool = False
        skip_dirs: Set[str] = set()
        
        for new_file in new_files:
            file_dir: str = os.path.dirname(new_file)
            suggested: str = suggest_category(new_file)
            
            if auto_accept_all:
                memo[new_file] = suggested
                continue
                
            if is_in_skipped_dir(new_file, skip_dirs):
                memo[new_file] = "ignore"
                continue
                
            prompt_label = f"[{suggested.upper()[0]}/{'d' if suggested == 'code' else 'c'}/n/s/a/q]"
            
            while True:
                user_input = input(f"Include {new_file}? {prompt_label} (default: {suggested}): ").strip().lower()
                
                # Default to suggested on Enter
                if user_input == '':
                    choice = suggested[0]
                else:
                    choice = user_input[0]

                if choice == 'c':
                    memo[new_file] = "code"
                    break
                elif choice == 'd':
                    memo[new_file] = "doc"
                    break
                elif choice == 'n':
                    memo[new_file] = "ignore"
                    break
                elif choice == 's':
                    skip_dirs.add(file_dir)
                    memo[new_file] = "ignore"
                    dir_name = file_dir if file_dir else "root directory"
                    print(f"Skipping all remaining new files in {dir_name}...")
                    break
                elif choice == 'a':
                    auto_accept_all = True
                    memo[new_file] = suggested
                    print("Accepting all remaining suggestions automatically...")
                    break
                elif choice == 'q':
                    print("Selection stopped. Proceeding with current choices.")
                    save_memo(memo)
                    generate_all(memo)
                    return
                else:
                    print("Invalid choice. Enter 'c' for Code, 'd' for Docs, 'n' for None, 's' for Skip dir, 'a' for All, or 'q' to Quit.")
    
    save_memo(memo)
    generate_all(memo)

def generate_all(memo: Dict[str, str]) -> None:
    code_files: List[str] = [f for f, cat in memo.items() if cat == "code"]
    doc_files: List[str] = [f for f, cat in memo.items() if cat == "doc"]
    
    print("\n--- Summary ---")
    print(f"Code files : {len(code_files)}")
    print(f"Docs files : {len(doc_files)}")
    print(f"Ignored    : {sum(1 for cat in memo.values() if cat == 'ignore')}\n")
    
    generate_bundle(
        files=code_files,
        output_file=CODE_OUTPUT_FILE,
        title="Codebase Context",
        description="This file contains the selected source code context for the LLM."
    )
    
    generate_bundle(
        files=doc_files,
        output_file=DOCS_OUTPUT_FILE,
        title="Documentation & Specifications Context",
        description="This file contains the documentation, specifications, and guides for the LLM."
    )

if __name__ == "__main__":
    main()