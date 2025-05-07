using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Office_Project.Web.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        [HttpGet("docx-files")]
        public async Task<IActionResult> GetDocxFiles([FromQuery] string folderPath)
        {
            try
            {
                if (string.IsNullOrEmpty(folderPath))
                {
                    return BadRequest("Folder path is required");
                }

                if (!Directory.Exists(folderPath))
                {
                    return NotFound("Specified folder does not exist");
                }

                var files = Directory.GetFiles(folderPath, "*.docx", SearchOption.AllDirectories)
                    .Select(file => new
                    {
                        FileName = Path.GetFileName(file),
                        FilePath = file,
                        LastModified = System.IO.File.GetLastWriteTime(file),
                        FileSize = new FileInfo(file).Length
                    })
                    .ToList();

                return Ok(files);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
} 