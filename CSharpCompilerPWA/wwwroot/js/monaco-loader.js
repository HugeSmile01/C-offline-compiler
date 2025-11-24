// Monaco Editor Loader with Fallback
let editor;
let usingMonaco = false;

function initializeFallbackEditor() {
    console.log('Initializing fallback editor');
    const editorDiv = document.getElementById('editor');
    
    // Create textarea editor
    const textarea = document.createElement('textarea');
    textarea.id = 'fallback-editor';
    textarea.style.cssText = `
        width: 100%;
        height: 100%;
        background: var(--bg-darker);
        color: var(--text-primary);
        border: none;
        padding: 1rem;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.6;
        resize: none;
        tab-size: 4;
    `;
    
    textarea.value = `WriteLine("Hello, World!");
WriteLine("Welcome to C# Compiler Pro!");

// Use WriteLine() for output
// Example: WriteLine("Your message");

// You can also return values
var sum = 5 + 3;
WriteLine("Sum: " + sum);`;
    
    editorDiv.innerHTML = '';
    editorDiv.appendChild(textarea);
    
    // Create simple editor interface
    editor = {
        getValue: () => textarea.value,
        setValue: (value) => { textarea.value = value; },
        getPosition: () => {
            const pos = textarea.selectionStart;
            const lines = textarea.value.substr(0, pos).split('\n');
            return {
                lineNumber: lines.length,
                column: lines[lines.length - 1].length + 1
            };
        }
    };
    
    // Update line/column counter
    textarea.addEventListener('keyup', () => {
        const position = editor.getPosition();
        document.getElementById('lineColumn').textContent = `Ln ${position.lineNumber}, Col ${position.column}`;
    });
    
    textarea.addEventListener('click', () => {
        const position = editor.getPosition();
        document.getElementById('lineColumn').textContent = `Ln ${position.lineNumber}, Col ${position.column}`;
    });
    
    // Update character count
    textarea.addEventListener('input', () => {
        const content = editor.getValue();
        document.getElementById('charCount').textContent = `${content.length} characters`;
    });
    
    window.monacoEditor = editor;
    console.log('Fallback editor initialized');
}

// Try to load Monaco first
if (typeof require !== 'undefined') {
    require.config({
        paths: {
            'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs'
        }
    });

    window.MonacoEnvironment = {
        getWorkerUrl: function(workerId, label) {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                self.MonacoEnvironment = {
                    baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/'
                };
                importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/base/worker/workerMain.js');`
            )}`;
        }
    };

    require(['vs/editor/editor.main'], function() {
        try {
            editor = monaco.editor.create(document.getElementById('editor'), {
                value: `WriteLine("Hello, World!");
WriteLine("Welcome to C# Compiler Pro!");

// Use WriteLine() for output
// Example: WriteLine("Your message");

// You can also return values
var sum = 5 + 3;
WriteLine("Sum: " + sum);`,
                language: 'csharp',
                theme: 'vs-dark',
                automaticLayout: true,
                fontSize: 14,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                bracketPairColorization: {
                    enabled: true
                },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                tabSize: 4,
                insertSpaces: true,
                formatOnPaste: true,
                formatOnType: true
            });

            // Update line/column counter
            editor.onDidChangeCursorPosition((e) => {
                const position = editor.getPosition();
                document.getElementById('lineColumn').textContent = `Ln ${position.lineNumber}, Col ${position.column}`;
            });

            // Update character count
            editor.onDidChangeModelContent(() => {
                const content = editor.getValue();
                document.getElementById('charCount').textContent = `${content.length} characters`;
            });

            window.monacoEditor = editor;
            usingMonaco = true;
            console.log('Monaco Editor initialized');
        } catch (error) {
            console.error('Monaco initialization failed:', error);
            initializeFallbackEditor();
        }
    }, function(error) {
        console.error('Monaco loading failed:', error);
        initializeFallbackEditor();
    });
} else {
    // Fallback if require is not available
    initializeFallbackEditor();
}

