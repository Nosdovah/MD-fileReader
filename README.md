# MD File-Reader

A premium, feature-rich Markdown reader and editor built with React and Vite. It provides a split-pane interface with a live preview, syntax highlighting, and robust export capabilities to PDF and Microsoft Word (DOCX) formats, styled specifically for clean printing.

## 🚀 Features

- **Live Split-Pane Preview**: Write or paste Markdown on the left, and watch it render instantly on the right.
- **Drag & Drop Upload**: An intuitive empty state that allows you to drag and drop your `.md` or `.txt` files directly into the web application to read them.
- **Syntax Highlighting**: Built-in support for multiple programming languages using Prism, which formats code blocks beautifully.
- **GitHub Flavored Markdown (GFM)**: Supports tables, checkboxes, task lists, blockquotes, and link styling natively.
- **Clean PDF Export**: Converts the rendered Markdown document into an A4 PDF page. It automatically strips the dark theme of the app and reformats tables, headers, and code blocks into a clean, highly readable light-theme print layout (including wrapping long pseudocode lines).
- **Microsoft Word (DOCX) Export**: Bundles the rendered HTML with custom inline styles for Word. When opened, MS Word reads the formatting, showing clean tables and structured headings on a white background.

---

## 🛠️ Tech Stack

- **Core**: React 19 + Vite 8
- **Markdown Parsing**: `react-markdown` + `remark-gfm`
- **Code Highlighting**: `react-syntax-highlighter` (using Prism's `vscDarkPlus` theme)
- **PDF Generation**: `html2pdf.js`
- **Iconography**: `lucide-react`
- **Styling**: Vanilla CSS (specifically optimized with print stylesheets inside `index.css`)

---

## 📦 Installation & Setup

1. **Clone the repository**:

   ```bash
   "git clone https://github.com/Nosdovah/MD-fileReader.git"
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open the browser**:
   Navigate to the local URL provided by the terminal (typically `http://localhost:5173/` or `http://localhost:5175/` if the default port is in use).

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🛠️ Troubleshooting & Technical Details

### Dark Theme vs. Export Theme

To prevent dark-theme background colors (like dark grey headers/table cells) from bleeding into printed formats:

- **PDF Export**: A temporary `.export-mode` CSS class is appended to a cloned DOM element. This class forces light-colored CSS variables (`--bg-primary: #ffffff !important`, `--border: #e2e8f0 !important`, etc.) and disables horizontal scrolling (`white-space: pre-wrap !important`), ensuring the PDF wraps text nicely.
- **DOCX Export**: The file is generated as a structured HTML stream wrapped with Microsoft Word XML definitions. It contains an embedded stylesheet defining light table borders and alternating row colors, preventing Word from adopting dark mode formatting.
