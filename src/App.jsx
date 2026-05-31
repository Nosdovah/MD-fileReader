import React, { useState, useRef } from 'react';
import './App.css';
import MarkdownViewer from './components/MarkdownViewer';
import { BookOpen, Upload, FileText, Download, Trash2, FileOutput } from 'lucide-react';
import html2pdf from 'html2pdf.js';



const INITIAL_MD = `# Welcome to MD Reader
Start typing in the editor on the left, or upload a markdown file.

## Features
- **Live Preview:** See changes instantly.
- **Syntax Highlighting:** Automatically highlights code blocks.
- **GitHub Flavored Markdown:** Supports tables, task lists, and more.

### Example Code
\`\`\`javascript
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

### Example Table
| Feature | Status |
|---------|--------|
| Parsing | ✅ Done |
| Styling | ✅ Done |
`;

function App() {
  const [content, setContent] = useState(INITIAL_MD);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      readFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt') || file.type.includes('text'))) {
      readFile(file);
    } else {
      alert('Please drop a valid markdown or text file.');
    }
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setContent(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleExportPDF = () => {
    const element = document.querySelector('.markdown-body');
    if (!element) return;
    
    // We clone the element to modify its styles for printing without affecting the UI
    const clone = element.cloneNode(true);
    clone.classList.add('export-mode');
    
    // Create a temporary wrapper to ensure the white background applies to the whole PDF page
    const wrapper = document.createElement('div');
    wrapper.style.backgroundColor = '#ffffff';
    wrapper.style.color = '#000000';
    wrapper.style.padding = '30px';
    wrapper.appendChild(clone);
    
    const opt = {
      margin:       10,
      filename:     'document.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(wrapper).save();
  };

  const handleExportDOCX = async () => {
    const element = document.querySelector('.markdown-body');
    if (!element) return;
    
    const htmlString = element.innerHTML;
    
    // Create a .doc file using HTML markup with injected light-theme CSS
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Export Document</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #000; background: #fff; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; color: #000; }
          tr { background-color: #fff; }
          tr:nth-child(even) { background-color: #f8fafc; }
          code { background-color: #f1f5f9; padding: 2px 4px; color: #000; }
          pre, .syntax-highlighter { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; color: #000; white-space: pre-wrap; word-wrap: break-word; }
          a { color: #2563eb; }
          blockquote { border-left: 4px solid #cbd5e1; padding-left: 10px; color: #475569; }
        </style>
      </head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + htmlString + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const a = document.createElement('a');
    a.href = source;
    a.download = 'document.doc'; // Save as .doc so Word opens it without complaints
    a.click();
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      setContent('');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <BookOpen className="logo-icon" size={28} />
          <h1 className="app-title">MD Reader</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleClear} title="Clear Editor">
            <Trash2 size={16} />
            Clear
          </button>
          <button className="btn btn-secondary" onClick={triggerFileInput}>
            <Upload size={16} />
            Upload File
          </button>
          <button className="btn btn-primary" onClick={handleExportPDF}>
            <FileOutput size={16} />
            PDF
          </button>
          <button className="btn btn-primary" onClick={handleExportDOCX}>
            <FileOutput size={16} />
            DOCX
          </button>
          <input
            type="file"
            accept=".md,.txt,text/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden-input"
          />
        </div>
      </header>

      {content === '' ? (
        <div 
          className="empty-state"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div 
            className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
            onClick={triggerFileInput}
          >
            <Upload className="upload-icon" size={48} />
            <div className="upload-text">
              {isDragActive ? 'Drop file here...' : 'Click or drag a markdown file to upload'}
            </div>
            <div className="upload-subtext">Supports .md, .txt files</div>
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>or start typing to create a new one.</div>
          <button className="btn btn-primary" onClick={() => setContent(INITIAL_MD)}>
            <FileText size={16} />
            Start with Template
          </button>
        </div>
      ) : (
        <main className="main-content">
          <section className="editor-pane">
            <div className="editor-header">
              <span>Markdown Editor</span>
              <span style={{ fontSize: '12px' }}>{content.length} chars</span>
            </div>
            <textarea
              className="editor-textarea"
              value={content}
              onChange={handleTextChange}
              placeholder="Type your markdown here..."
              spellCheck="false"
            />
          </section>
          
          <section className="preview-pane">
            <div className="preview-header">
              <span>Preview</span>
            </div>
            <MarkdownViewer content={content} />
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
