using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using System.Reflection;
using System.Text;

namespace CSharpCompilerPWA.Services
{
    public class CompilationResult
    {
        public bool Success { get; set; }
        public string? Output { get; set; }
        public List<string> Errors { get; set; } = new();
        public List<string> Warnings { get; set; } = new();
    }

    public class ScriptGlobals
    {
        private readonly StringBuilder _output = new();

        public void Print(object? value)
        {
            _output.AppendLine(value?.ToString() ?? "null");
        }

        public void WriteLine(object? value)
        {
            _output.AppendLine(value?.ToString() ?? "null");
        }

        public void Write(object? value)
        {
            _output.Append(value?.ToString() ?? "null");
        }

        public string GetOutput() => _output.ToString();
    }

    public class CompilationService
    {
        private readonly ILogger<CompilationService> _logger;

        public CompilationService(ILogger<CompilationService> logger)
        {
            _logger = logger;
        }

        public async Task<CompilationResult> CompileAndRunAsync(string code, string? input = null)
        {
            var result = new CompilationResult();

            try
            {
                _logger.LogInformation("Starting compilation. Code length: {Length}", code.Length);
                
                var globals = new ScriptGlobals();
                
                // Setup script options with common assemblies
                var scriptOptions = ScriptOptions.Default
                    .AddReferences(
                        typeof(object).Assembly,
                        typeof(Console).Assembly,
                        typeof(System.Linq.Enumerable).Assembly,
                        typeof(System.Collections.Generic.List<>).Assembly,
                        typeof(System.Text.StringBuilder).Assembly,
                        typeof(System.IO.File).Assembly
                    )
                    .AddImports(
                        "System",
                        "System.Collections.Generic",
                        "System.Linq",
                        "System.Text",
                        "System.IO",
                        "System.Threading.Tasks"
                    );

                // Execute the script with globals
                var scriptResult = await CSharpScript.RunAsync(code, scriptOptions, globals);
                
                _logger.LogInformation("Script executed");
                
                // Get output from globals
                var output = globals.GetOutput();
                
                // If there's a return value, add it to output
                if (scriptResult.ReturnValue != null && string.IsNullOrEmpty(output))
                {
                    output = scriptResult.ReturnValue.ToString();
                }
                else if (scriptResult.ReturnValue != null)
                {
                    output += "\nReturn value: " + scriptResult.ReturnValue.ToString();
                }

                result.Output = output;
                result.Success = true;
                
                _logger.LogInformation("Result success: {Success}, Output length: {Length}", result.Success, result.Output?.Length ?? 0);
            }
            catch (CompilationErrorException ex)
            {
                result.Success = false;
                foreach (var diagnostic in ex.Diagnostics)
                {
                    var message = $"Line {diagnostic.Location.GetLineSpan().StartLinePosition.Line + 1}: {diagnostic.GetMessage()}";
                    
                    if (diagnostic.Severity == DiagnosticSeverity.Error)
                    {
                        result.Errors.Add(message);
                    }
                    else if (diagnostic.Severity == DiagnosticSeverity.Warning)
                    {
                        result.Warnings.Add(message);
                    }
                }
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Errors.Add($"Runtime error: {ex.Message}");
            }

            return result;
        }

        public async Task<CompilationResult> CompileToAssemblyAsync(string code)
        {
            var result = new CompilationResult();

            try
            {
                // Parse the code
                var syntaxTree = CSharpSyntaxTree.ParseText(code);

                // Get references
                var references = new[]
                {
                    MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
                    MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
                    MetadataReference.CreateFromFile(typeof(System.Linq.Enumerable).Assembly.Location),
                    MetadataReference.CreateFromFile(Assembly.Load("System.Runtime").Location),
                    MetadataReference.CreateFromFile(Assembly.Load("System.Collections").Location),
                    MetadataReference.CreateFromFile(Assembly.Load("System.Console").Location)
                };

                // Create compilation
                var compilation = CSharpCompilation.Create(
                    "DynamicAssembly",
                    new[] { syntaxTree },
                    references,
                    new CSharpCompilationOptions(OutputKind.ConsoleApplication));

                // Compile to memory stream
                using var ms = new MemoryStream();
                var emitResult = compilation.Emit(ms);

                if (emitResult.Success)
                {
                    result.Success = true;
                    result.Output = "Compilation successful";
                }
                else
                {
                    result.Success = false;
                    foreach (var diagnostic in emitResult.Diagnostics)
                    {
                        if (diagnostic.Severity == DiagnosticSeverity.Error)
                        {
                            var message = $"Line {diagnostic.Location.GetLineSpan().StartLinePosition.Line + 1}: {diagnostic.GetMessage()}";
                            result.Errors.Add(message);
                        }
                        else if (diagnostic.Severity == DiagnosticSeverity.Warning)
                        {
                            var message = $"Line {diagnostic.Location.GetLineSpan().StartLinePosition.Line + 1}: {diagnostic.GetMessage()}";
                            result.Warnings.Add(message);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Errors.Add($"Compilation error: {ex.Message}");
            }

            return result;
        }
    }
}
