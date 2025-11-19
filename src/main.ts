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
const fonts = [
  { name: 'Fira Code', value: "'Fira Code', monospace" },
  { name: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { name: 'Roboto Mono', value: "'Roboto Mono', monospace" },
  { name: 'Source Code Pro', value: "'Source Code Pro', monospace" },
  { name: 'Inconsolata', value: "'Inconsolata', monospace" },
  { name: 'IBM Plex Mono', value: "'IBM Plex Mono', monospace" },
  { name: 'Ubuntu Mono', value: "'Ubuntu Mono', monospace" },
  { name: 'System Monospace', value: 'monospace' }
];

let currentFont = fonts[0];

// Vim mode state
let vimModeEnabled = false;
let vimMode: any = null;

// Render font list
function renderFontList(filter = '') {
  const filteredFonts = fonts.filter(font =>
    font.name.toLowerCase().includes(filter.toLowerCase())
  );

  fontList.innerHTML = filteredFonts.map(font => `
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
}

// Select font
function selectFont(fontValue: string, fontName: string) {
  currentFont = fonts.find(f => f.value === fontValue) || fonts[0];
  currentFontName.textContent = fontName;
  editor.updateOptions({
    fontFamily: fontValue
  });
}

// Open modal
function openModal() {
  fontModal.classList.add('active');
  fontSearch.value = '';
  renderFontList();
  setTimeout(() => fontSearch.focus(), 100);
}

// Close modal
function closeModal() {
  fontModal.classList.remove('active');
}

// Event listeners
fontButton.addEventListener('click', openModal);
fontModalOverlay.addEventListener('click', closeModal);
fontSearch.addEventListener('input', () => {
  renderFontList(fontSearch.value);
});

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
