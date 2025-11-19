import './style.css';
import * as monaco from 'monaco-editor';
import { initVimMode } from 'monaco-vim';

// Sample code snippets for different languages
const codeSnippets: Record<string, string> = {
  javascript: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(\`Fibonacci(10) = \${result}\`);

// Arrow function example
const greet = (name) => {
  return \`Hello, \${name}!\`;
};`,

  typescript: `// TypeScript Example
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email
  };
}

const user = createUser("Alice", "alice@example.com");
console.log(user);`,

  python: `# Python Example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(10)
print(f"Fibonacci(10) = {result}")

# List comprehension
squares = [x**2 for x in range(10)]
print(squares)`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
</head>
<body>
  <header>
    <h1>Welcome to My Site</h1>
  </header>
  <main>
    <p>This is a sample HTML document.</p>
  </main>
</body>
</html>`,

  css: `/* CSS Example */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}

.card {
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}`,

  json: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample JSON configuration",
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  }
}`,

  rust: `// Rust Example
fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    let result = fibonacci(10);
    println!("Fibonacci(10) = {}", result);
    
    let numbers: Vec<i32> = (0..10).collect();
    println!("{:?}", numbers);
}`,

  go: `// Go Example
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    result := fibonacci(10)
    fmt.Printf("Fibonacci(10) = %d\\n", result)
    
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Println(numbers)
}`,

  java: `// Java Example
public class Main {
    public static int fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        int result = fibonacci(10);
        System.out.println("Fibonacci(10) = " + result);
        
        int[] numbers = {1, 2, 3, 4, 5};
        for (int num : numbers) {
            System.out.println(num);
        }
    }
}`,

  cpp: `// C++ Example
#include <iostream>
#include <vector>

int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int result = fibonacci(10);
    std::cout << "Fibonacci(10) = " << result << std::endl;
    
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    for (int num : numbers) {
        std::cout << num << " ";
    }
    return 0;
}`
};

// Initialize Monaco Editor
const container = document.getElementById('editor-container');
if (!container) {
  throw new Error('Editor container not found');
}

const editor = monaco.editor.create(container, {
  value: codeSnippets.javascript,
  language: 'javascript',
  theme: 'vs-dark',
  fontSize: 16,
  lineHeight: 24,
  fontWeight: '400',
  fontFamily: "'Fira Code', monospace",
  automaticLayout: true,
  minimap: {
    enabled: true
  },
  scrollBeyondLastLine: false,
  renderWhitespace: 'selection',
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  smoothScrolling: true,
  fontLigatures: true
});

// Get control elements
const fontButton = document.getElementById('font-button') as HTMLButtonElement;
const currentFontName = document.getElementById('current-font-name') as HTMLSpanElement;
const fontModal = document.getElementById('font-modal') as HTMLDivElement;
const fontModalOverlay = fontModal.querySelector('.font-modal-overlay') as HTMLDivElement;
const fontSearch = document.getElementById('font-search') as HTMLInputElement;
const fontList = document.getElementById('font-list') as HTMLDivElement;
const fontSizeInput = document.getElementById('font-size') as HTMLInputElement;
const lineHeightInput = document.getElementById('line-height') as HTMLInputElement;
const fontWeightSelect = document.getElementById('font-weight') as HTMLSelectElement;
const languageSelect = document.getElementById('language-select') as HTMLSelectElement;
const vimToggle = document.getElementById('vim-toggle') as HTMLButtonElement;

// Font definitions
interface Font {
  name: string;
  value: string;
  category?: string;
}

const top15Fonts: Font[] = [
  { name: 'Fira Code', value: "'Fira Code', monospace" },
  { name: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { name: 'Roboto Mono', value: "'Roboto Mono', monospace" },
  { name: 'Source Code Pro', value: "'Source Code Pro', monospace" },
  { name: 'Inconsolata', value: "'Inconsolata', monospace" },
  { name: 'IBM Plex Mono', value: "'IBM Plex Mono', monospace" },
  { name: 'Ubuntu Mono', value: "'Ubuntu Mono', monospace" },
  { name: 'Space Mono', value: "'Space Mono', monospace" },
  { name: 'Anonymous Pro', value: "'Anonymous Pro', monospace" },
  { name: 'PT Mono', value: "'PT Mono', monospace" },
  { name: 'Cousine', value: "'Cousine', monospace" },
  { name: 'Fira Mono', value: "'Fira Mono', monospace" },
  { name: 'VT323', value: "'VT323', monospace" },
  { name: 'Share Tech Mono', value: "'Share Tech Mono', monospace" },
  { name: 'Oxygen Mono', value: "'Oxygen Mono', monospace" }
];

let currentFont = top15Fonts[0];

// Vim mode state
let vimModeEnabled = false;
let vimMode: any = null;

// Google Fonts API
const GOOGLE_FONTS_API_KEY = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
const GOOGLE_FONTS_API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

async function fetchFonts(query: string) {
  if (!query) return top15Fonts;

  try {
    const response = await fetch(`${GOOGLE_FONTS_API_URL}?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`);
    const data = await response.json();

    if (!data.items) return [];

    const items = data.items as any[];
    return items
      .filter((item: any) => item.family.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 20) // Limit results
      .map((item: any) => ({
        name: item.family,
        value: `'${item.family}', ${item.category || 'monospace'}`,
        category: item.category
      }));
  } catch (error) {
    console.error('Error fetching fonts:', error);
    return [];
  }
}

// Debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T;
}

// Dynamic Font Loading
function loadFont(fontName: string) {
  const linkId = `font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}&display=swap`;
    document.head.appendChild(link);
  }
}

// Render font list
function renderFontList(fontsToRender: Font[]) {
  if (fontsToRender.length === 0) {
    fontList.innerHTML = '<div class="no-fonts-message">No fonts found matching your search.</div>';
    return;
  }

  fontList.innerHTML = fontsToRender.map(font => `
    <div class="font-item ${font.value === currentFont.value ? 'selected' : ''}" 
         data-font-value="${font.value}"
         data-font-name="${font.name}"
         style="font-family: ${font.value}">
      ${font.name}
    </div>
  `).join('');

  // Add click handlers
  fontList.querySelectorAll('.font-item').forEach(item => {
    item.addEventListener('click', () => {
      const fontValue = item.getAttribute('data-font-value')!;
      const fontName = item.getAttribute('data-font-name')!;
      selectFont(fontValue, fontName);
      closeModal();
    });
  });

  // Load fonts for preview (optional, but good for UX)
  // Note: Loading all might be heavy, maybe just load visible ones or rely on system fonts for preview if not loaded
  fontsToRender.forEach(font => {
    // We can lazily load them, or just let them fallback until selected
    // For the top 15, they are likely already loaded or we can load them.
    // For search results, we should probably load them to preview.
    if (!top15Fonts.find(f => f.name === font.name)) {
      loadFont(font.name);
    }
  });
}

// Select font
function selectFont(fontValue: string, fontName: string) {
  // Ensure font is loaded
  loadFont(fontName);

  currentFont = { name: fontName, value: fontValue };
  currentFontName.textContent = fontName;
  editor.updateOptions({
    fontFamily: fontValue
  });
}

// Open modal
function openModal() {
  fontModal.classList.add('active');
  fontSearch.value = '';
  renderFontList(top15Fonts);
  setTimeout(() => fontSearch.focus(), 100);
}

// Close modal
function closeModal() {
  fontModal.classList.remove('active');
}

// Event listeners
fontButton.addEventListener('click', openModal);
fontModalOverlay.addEventListener('click', closeModal);

const handleSearch = debounce(async () => {
  const query = fontSearch.value.trim();
  if (query.length === 0) {
    renderFontList(top15Fonts);
    return;
  }

  const results = await fetchFonts(query);
  renderFontList(results);
}, 500);

fontSearch.addEventListener('input', handleSearch);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && fontModal.classList.contains('active')) {
    closeModal();
  }
});

// Update font size
fontSizeInput.addEventListener('input', () => {
  const size = parseInt(fontSizeInput.value);
  editor.updateOptions({
    fontSize: size
  });
});

// Update line height
lineHeightInput.addEventListener('input', () => {
  const lineHeight = parseFloat(lineHeightInput.value);
  const fontSize = parseInt(fontSizeInput.value);
  editor.updateOptions({
    lineHeight: Math.round(fontSize * lineHeight)
  });
});

// Update font weight
fontWeightSelect.addEventListener('change', () => {
  editor.updateOptions({
    fontWeight: fontWeightSelect.value
  });
});

// Update language
languageSelect.addEventListener('change', () => {
  const language = languageSelect.value;
  const model = editor.getModel();
  if (model) {
    monaco.editor.setModelLanguage(model, language);
    editor.setValue(codeSnippets[language] || '// No sample code available');
  }
});

// Toggle Vim mode
vimToggle.addEventListener('click', () => {
  vimModeEnabled = !vimModeEnabled;

  if (vimModeEnabled) {
    vimToggle.classList.add('active');
    // Initialize Vim mode
    vimMode = initVimMode(editor, document.getElementById('vim-status-bar'));
    console.log('Vim mode enabled');
  } else {
    vimToggle.classList.remove('active');
    // Dispose Vim mode
    if (vimMode) {
      vimMode.dispose();
      vimMode = null;
    }
    console.log('Vim mode disabled');
  }
});
