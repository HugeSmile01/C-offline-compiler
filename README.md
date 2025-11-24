# C# Compiler Pro

A powerful, mobile-based C# compiler with PWA support and aesthetic UI. Write, compile, and run C# code directly in your browser - works offline!

## ✨ Features

- **🎨 Beautiful Modern UI**: Dark theme with glassmorphism effects and gradient accents
- **💻 Monaco Editor**: Full-featured code editor with C# syntax highlighting and IntelliSense
- **⚡ Real-time Compilation**: Powered by Microsoft Roslyn compiler
- **📱 PWA Support**: Install as a native app, works offline
- **📂 Project Management**: Create, save, import, and export projects
- **🔄 Auto-save**: Never lose your work with automatic saving
- **📝 Multiple Files**: Organize your code in multiple files
- **⌨️ Keyboard Shortcuts**: Speed up your workflow
- **🌙 Theme Toggle**: Switch between dark and light themes
- **📊 Console Output**: View compilation results and program output

## 🚀 Getting Started

### Prerequisites

- .NET 8.0 SDK or later
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HugeSmile01/C-offline-compiler.git
cd C-offline-compiler
```

2. Navigate to the project directory:
```bash
cd CSharpCompilerPWA
```

3. Restore dependencies:
```bash
dotnet restore
```

4. Run the application:
```bash
dotnet run
```

5. Open your browser and navigate to `http://localhost:5026` (or the URL shown in the console)

## 📝 Usage

Write C# code using the custom output methods:

```csharp
// Simple output
WriteLine("Hello, World!");

// Variables and calculations
var sum = 5 + 3;
WriteLine("Sum: " + sum);

// Collections
var numbers = new int[] { 1, 2, 3, 4, 5 };
WriteLine("Numbers: " + string.Join(", ", numbers));

// LINQ queries
var evens = numbers.Where(x => x % 2 == 0);
WriteLine("Even numbers: " + string.Join(", ", evens));
```

### Available Output Methods

- `WriteLine(object)` - Write a line of output
- `Write(object)` - Write output without a newline
- `Print(object)` - Alias for WriteLine

### Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save project
- `F5` or `Ctrl/Cmd + Enter` - Run code
- `Ctrl/Cmd + B` - Compile only

## 🏗️ Architecture

### Backend
- **ASP.NET Core 8.0** - Web framework
- **Microsoft.CodeAnalysis.CSharp** - Roslyn compiler
- **Razor Pages** - Server-side rendering
- **Web API** - REST endpoints for compilation

### Frontend
- **Monaco Editor** - Code editor
- **Custom CSS** - Modern, responsive design
- **Vanilla JavaScript** - No framework dependencies
- **Service Worker** - PWA offline support

### Project Structure

```
CSharpCompilerPWA/
├── Controllers/
│   └── CompilerController.cs      # API endpoints for compilation
├── Services/
│   └── CompilationService.cs      # Roslyn compilation logic
├── Pages/
│   ├── Index.cshtml               # Main application UI
│   └── Shared/_Layout.cshtml      # Application layout
├── wwwroot/
│   ├── css/site.css               # Application styles
│   ├── js/
│   │   ├── compiler.js            # Application logic
│   │   ├── monaco-loader.js       # Editor initialization
│   │   └── site.js                # PWA functionality
│   ├── manifest.json              # PWA manifest
│   └── service-worker.js          # Offline support
└── Program.cs                     # Application startup
```

## 🔒 Security

- Code execution is sandboxed using Roslyn scripting
- No file system access beyond browser storage
- Input validation on all API endpoints
- Client-side project storage only (LocalStorage)

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Technologies

- [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet) - Web framework
- [Roslyn](https://github.com/dotnet/roslyn) - C# compiler
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [PWA](https://web.dev/progressive-web-apps/) - Progressive Web App

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by habal.fun's aesthetic design
- Monaco Editor by Microsoft
- Roslyn compiler by .NET Foundation
