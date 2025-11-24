// C# Compiler Pro - Main JavaScript
class CompilerApp {
    constructor() {
        this.currentFile = 'main.cs';
        this.files = {
            'main.cs': `WriteLine("Hello, World!");
WriteLine("Welcome to C# Compiler Pro!");

// Use WriteLine() for output
// Example: WriteLine("Your message");

// You can also return values
var sum = 5 + 3;
WriteLine("Sum: " + sum);`
        };
        this.projectName = 'MyProject';
        this.isRunning = false;
        this.theme = 'dark';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.updateFileTree();
    }

    setupEventListeners() {
        // Run button
        document.getElementById('runBtn').addEventListener('click', () => this.runCode());
        
        // Compile button
        document.getElementById('compileBtn').addEventListener('click', () => this.compileCode());
        
        // Clear console
        document.getElementById('clearConsoleBtn').addEventListener('click', () => this.clearConsole());
        
        // Console tabs
        document.querySelectorAll('.console-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchConsoleTab(e.target.closest('.console-tab').dataset.tab));
        });
        
        // New project
        document.getElementById('newProjectBtn').addEventListener('click', () => this.newProject());
        
        // Save project
        document.getElementById('saveProjectBtn').addEventListener('click', () => this.saveProject());
        
        // Open project
        document.getElementById('openProjectBtn').addEventListener('click', () => this.openProject());
        
        // Export project
        document.getElementById('exportBtn').addEventListener('click', () => this.exportProject());
        
        // Import file
        document.getElementById('importBtn').addEventListener('click', () => this.importFile());
        
        // Add file
        document.getElementById('addFileBtn').addEventListener('click', () => this.addFile());
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // File inputs
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileImport(e));
        document.getElementById('projectInput').addEventListener('change', (e) => this.handleProjectImport(e));
        
        // Auto-save every 30 seconds
        setInterval(() => this.autoSave(), 30000);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    async runCode() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const runBtn = document.getElementById('runBtn');
        const originalContent = runBtn.innerHTML;
        runBtn.innerHTML = '<div class="spinner"></div> Running...';
        runBtn.disabled = true;

        try {
            const code = window.monacoEditor ? window.monacoEditor.getValue() : this.files[this.currentFile];
            const input = document.getElementById('inputArea').value;

            const response = await fetch('/api/compiler/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, input })
            });

            const result = await response.json();
            this.displayOutput(result);
            this.switchConsoleTab('output');
        } catch (error) {
            this.displayError('Failed to execute code: ' + error.message);
        } finally {
            this.isRunning = false;
            runBtn.innerHTML = originalContent;
            runBtn.disabled = false;
        }
    }

    async compileCode() {
        const compileBtn = document.getElementById('compileBtn');
        const originalContent = compileBtn.innerHTML;
        compileBtn.innerHTML = '<div class="spinner"></div> Compiling...';
        compileBtn.disabled = true;

        try {
            const code = window.monacoEditor ? window.monacoEditor.getValue() : this.files[this.currentFile];

            const response = await fetch('/api/compiler/compile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            const result = await response.json();
            this.displayOutput(result);
            this.switchConsoleTab('output');
        } catch (error) {
            this.displayError('Failed to compile code: ' + error.message);
        } finally {
            compileBtn.innerHTML = originalContent;
            compileBtn.disabled = false;
        }
    }

    displayOutput(result) {
        const outputContent = document.getElementById('outputContent');
        outputContent.innerHTML = '';

        if (result.errors && result.errors.length > 0) {
            result.errors.forEach(error => {
                const errorLine = document.createElement('div');
                errorLine.className = 'output-line error';
                errorLine.innerHTML = `<i class="fas fa-times-circle"></i> ${this.escapeHtml(error)}`;
                outputContent.appendChild(errorLine);
            });
        }

        if (result.warnings && result.warnings.length > 0) {
            result.warnings.forEach(warning => {
                const warningLine = document.createElement('div');
                warningLine.className = 'output-line warning';
                warningLine.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${this.escapeHtml(warning)}`;
                outputContent.appendChild(warningLine);
            });
        }

        if (result.output) {
            const lines = result.output.split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    const outputLine = document.createElement('div');
                    outputLine.className = 'output-line';
                    outputLine.textContent = line;
                    outputContent.appendChild(outputLine);
                }
            });
        }

        if (result.success) {
            const successLine = document.createElement('div');
            successLine.className = 'output-line success';
            successLine.innerHTML = '<i class="fas fa-check-circle"></i> Execution completed successfully!';
            outputContent.appendChild(successLine);
        }
    }

    displayError(message) {
        const outputContent = document.getElementById('outputContent');
        outputContent.innerHTML = '';
        
        const errorLine = document.createElement('div');
        errorLine.className = 'output-line error';
        errorLine.innerHTML = `<i class="fas fa-times-circle"></i> ${this.escapeHtml(message)}`;
        outputContent.appendChild(errorLine);
    }

    clearConsole() {
        document.getElementById('outputContent').innerHTML = `
            <div class="welcome-message">
                <i class="fas fa-info-circle"></i>
                <p>Console cleared. Write your code and click Run to execute.</p>
            </div>
        `;
    }

    switchConsoleTab(tab) {
        document.querySelectorAll('.console-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.console-pane').forEach(p => p.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}Pane`).classList.add('active');
    }

    newProject() {
        if (confirm('Create a new project? Unsaved changes will be lost.')) {
            this.projectName = prompt('Enter project name:', 'MyProject') || 'MyProject';
            this.files = {
                'main.cs': `WriteLine("Hello from ${this.projectName}!");

// Use WriteLine() for output
var numbers = new int[] { 1, 2, 3, 4, 5 };
WriteLine("Numbers: " + string.Join(", ", numbers));`
            };
            this.currentFile = 'main.cs';
            this.updateFileTree();
            if (window.monacoEditor) {
                window.monacoEditor.setValue(this.files[this.currentFile]);
            }
            this.clearConsole();
        }
    }

    saveProject() {
        if (window.monacoEditor) {
            this.files[this.currentFile] = window.monacoEditor.getValue();
        }
        localStorage.setItem('csharp-compiler-project', JSON.stringify({
            name: this.projectName,
            files: this.files,
            currentFile: this.currentFile
        }));
        this.showNotification('Project saved!', 'success');
    }

    autoSave() {
        if (window.monacoEditor) {
            this.files[this.currentFile] = window.monacoEditor.getValue();
        }
        localStorage.setItem('csharp-compiler-project', JSON.stringify({
            name: this.projectName,
            files: this.files,
            currentFile: this.currentFile
        }));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('csharp-compiler-project');
        if (saved) {
            try {
                const project = JSON.parse(saved);
                this.projectName = project.name;
                this.files = project.files;
                this.currentFile = project.currentFile;
            } catch (e) {
                console.error('Failed to load saved project:', e);
            }
        }
    }

    openProject() {
        document.getElementById('projectInput').click();
    }

    handleProjectImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const project = JSON.parse(event.target.result);
                this.projectName = project.name;
                this.files = project.files;
                this.currentFile = project.currentFile;
                this.updateFileTree();
                if (window.monacoEditor) {
                    window.monacoEditor.setValue(this.files[this.currentFile]);
                }
                this.showNotification('Project loaded!', 'success');
            } catch (error) {
                this.showNotification('Failed to load project', 'error');
            }
        };
        reader.readAsText(file);
    }

    exportProject() {
        if (window.monacoEditor) {
            this.files[this.currentFile] = window.monacoEditor.getValue();
        }
        
        const project = {
            name: this.projectName,
            files: this.files,
            currentFile: this.currentFile
        };
        
        const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.projectName}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Project exported!', 'success');
    }

    importFile() {
        document.getElementById('fileInput').click();
    }

    handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const fileName = file.name;
            this.files[fileName] = event.target.result;
            this.currentFile = fileName;
            this.updateFileTree();
            if (window.monacoEditor) {
                window.monacoEditor.setValue(this.files[this.currentFile]);
            }
            this.showNotification(`File ${fileName} imported!`, 'success');
        };
        reader.readAsText(file);
    }

    addFile() {
        const fileName = prompt('Enter file name (e.g., MyClass.cs):', 'NewFile.cs');
        if (fileName) {
            this.files[fileName] = `using System;

class ${fileName.replace('.cs', '')}
{
    // Your code here
}`;
            this.currentFile = fileName;
            this.updateFileTree();
            if (window.monacoEditor) {
                window.monacoEditor.setValue(this.files[this.currentFile]);
            }
        }
    }

    updateFileTree() {
        const fileTree = document.getElementById('fileTree');
        fileTree.innerHTML = '';
        
        Object.keys(this.files).forEach(fileName => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item' + (fileName === this.currentFile ? ' active' : '');
            fileItem.dataset.file = fileName;
            fileItem.innerHTML = `
                <i class="fas fa-file-code"></i>
                <span>${fileName}</span>
            `;
            fileItem.addEventListener('click', () => this.switchFile(fileName));
            fileTree.appendChild(fileItem);
        });
    }

    switchFile(fileName) {
        if (window.monacoEditor && this.currentFile) {
            this.files[this.currentFile] = window.monacoEditor.getValue();
        }
        
        this.currentFile = fileName;
        if (window.monacoEditor) {
            window.monacoEditor.setValue(this.files[fileName]);
        }
        
        this.updateFileTree();
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        const icon = document.querySelector('#themeToggle i');
        
        if (this.theme === 'light') {
            document.documentElement.style.setProperty('--bg-dark', '#f8fafc');
            document.documentElement.style.setProperty('--bg-darker', '#ffffff');
            document.documentElement.style.setProperty('--bg-light', '#e2e8f0');
            document.documentElement.style.setProperty('--text-primary', '#0f172a');
            document.documentElement.style.setProperty('--text-secondary', '#475569');
            icon.className = 'fas fa-sun';
            
            if (window.monacoEditor) {
                monaco.editor.setTheme('vs');
            }
        } else {
            document.documentElement.style.setProperty('--bg-dark', '#0a0e27');
            document.documentElement.style.setProperty('--bg-darker', '#060918');
            document.documentElement.style.setProperty('--bg-light', '#1a1f3a');
            document.documentElement.style.setProperty('--text-primary', '#f8fafc');
            document.documentElement.style.setProperty('--text-secondary', '#94a3b8');
            icon.className = 'fas fa-moon';
            
            if (window.monacoEditor) {
                monaco.editor.setTheme('vs-dark');
            }
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S: Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveProject();
        }
        
        // F5 or Ctrl/Cmd + Enter: Run
        if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
            e.preventDefault();
            this.runCode();
        }
        
        // Ctrl/Cmd + B: Compile
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            this.compileCode();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary)'};
            color: white;
            border-radius: 8px;
            box-shadow: var(--shadow);
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.compilerApp = new CompilerApp();
    });
} else {
    window.compilerApp = new CompilerApp();
}
