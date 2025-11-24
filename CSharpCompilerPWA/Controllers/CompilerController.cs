using Microsoft.AspNetCore.Mvc;
using CSharpCompilerPWA.Services;

namespace CSharpCompilerPWA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompilerController : ControllerBase
    {
        private readonly CompilationService _compilationService;
        private readonly ILogger<CompilerController> _logger;

        public CompilerController(CompilationService compilationService, ILogger<CompilerController> logger)
        {
            _compilationService = compilationService;
            _logger = logger;
        }

        [HttpPost("run")]
        public async Task<ActionResult<CompilationResult>> RunCode([FromBody] CodeExecutionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Code))
            {
                return BadRequest(new { error = "Code cannot be empty" });
            }

            try
            {
                var result = await _compilationService.CompileAndRunAsync(request.Code, request.Input);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error running code");
                return StatusCode(500, new { error = "An error occurred while running the code" });
            }
        }

        [HttpPost("compile")]
        public async Task<ActionResult<CompilationResult>> CompileCode([FromBody] CodeCompilationRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Code))
            {
                return BadRequest(new { error = "Code cannot be empty" });
            }

            try
            {
                var result = await _compilationService.CompileToAssemblyAsync(request.Code);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error compiling code");
                return StatusCode(500, new { error = "An error occurred while compiling the code" });
            }
        }
    }

    public class CodeExecutionRequest
    {
        public string Code { get; set; } = string.Empty;
        public string? Input { get; set; }
    }

    public class CodeCompilationRequest
    {
        public string Code { get; set; } = string.Empty;
    }
}
