import { Component, ElementRef, ViewChild } from '@angular/core';
import { Document, Packer, Paragraph, TextRun, Style, IStylesOptions } from 'docx';
import * as XLSX from 'xlsx';

interface BlockAnalysis {
  id: number;
  text: string;
  style: {
    font: string;
    size: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  spellIssues: SpellIssue[];
  suggestions: string[];
}

interface SpellIssue {
  type: string;
  word: string;
  suggestion: string;
  severity: 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-spell-check',
  templateUrl: './spell-check.component.html',
  styleUrls: ['./spell-check.component.css']
})
export class SpellCheckComponent {
  @ViewChild('documentContainer') documentContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile: File | null = null;
  blocks: BlockAnalysis[] = [];
  selectedBlock: BlockAnalysis | null = null;
  showSuggestions = false;
  isLoading = false;
  error: string | null = null;

  // Vietnamese dictionary for spell checking
  private vietnameseDictionary = new Set([
    'xin', 'chào', 'cảm', 'ơn', 'tạm', 'biệt', 'vâng', 'không',
    // Add more Vietnamese words here
  ]);

  constructor() { }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.analyzeDocument();
    }
  }

  private async analyzeDocument(): Promise<void> {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.error = null;

    try {
      const arrayBuffer = await this.selectedFile.arrayBuffer();
      const doc = new Document({
        sections: [{
          properties: {},
          children: []
        }]
      });
      
      // Extract and analyze blocks
      this.blocks = [];
      let blockId = 1;

      // For now, we'll create a simple block from the file name
      // In a real implementation, you would parse the DOCX file properly
      const block: BlockAnalysis = {
        id: blockId,
        text: this.selectedFile.name,
        style: {
          font: 'Arial',
          size: 12,
          bold: false,
          italic: false,
          underline: false
        },
        spellIssues: [],
        suggestions: []
      };

      // Check spelling
      this.checkSpelling(block);
      
      // Generate suggestions
      this.generateSuggestions(block);

      this.blocks.push(block);

      // Update document preview
      this.updateDocumentPreview();
    } catch (err) {
      this.error = 'Error analyzing document: ' + (err as Error).message;
    } finally {
      this.isLoading = false;
    }
  }

  private checkSpelling(block: BlockAnalysis): void {
    const words = block.text.split(/\s+/);
    
    for (const word of words) {
      const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
      
      if (!this.vietnameseDictionary.has(cleanWord)) {
        block.spellIssues.push({
          type: 'Spelling',
          word,
          suggestion: this.findSuggestion(cleanWord),
          severity: 'error'
        });
      }
    }
  }

  private findSuggestion(word: string): string {
    // Implement suggestion algorithm here
    // For now, return a simple suggestion
    return word + ' (suggested correction)';
  }

  private generateSuggestions(block: BlockAnalysis): void {
    if (block.spellIssues.length > 0) {
      // Generate suggestions based on spell issues
      block.suggestions = block.spellIssues.map(issue => {
        const words = block.text.split(/\s+/);
        const index = words.indexOf(issue.word);
        if (index !== -1) {
          words[index] = issue.suggestion;
        }
        return words.join(' ');
      });
    }
  }

  private updateDocumentPreview(): void {
    if (!this.documentContainer) return;

    const container = this.documentContainer.nativeElement;
    container.innerHTML = '';

    for (const block of this.blocks) {
      const blockElement = document.createElement('div');
      blockElement.className = 'preview-block';
      blockElement.style.fontFamily = block.style.font;
      blockElement.style.fontSize = `${block.style.size}pt`;
      if (block.style.bold) blockElement.style.fontWeight = 'bold';
      if (block.style.italic) blockElement.style.fontStyle = 'italic';
      if (block.style.underline) blockElement.style.textDecoration = 'underline';
      
      blockElement.textContent = block.text;
      container.appendChild(blockElement);
    }
  }

  selectBlock(block: BlockAnalysis): void {
    this.selectedBlock = block;
    this.showSuggestions = true;
  }

  applySuggestion(block: BlockAnalysis, suggestion: string): void {
    const index = this.blocks.findIndex(b => b.id === block.id);
    if (index !== -1) {
      this.blocks[index].text = suggestion;
      this.blocks[index].spellIssues = [];
      this.blocks[index].suggestions = [];
      this.updateDocumentPreview();
    }
    this.showSuggestions = false;
  }

  async downloadDocument(): Promise<void> {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: this.blocks.map(block => new Paragraph({
            children: [
              new TextRun({
                text: block.text,
                bold: block.style.bold,
                italics: block.style.italic,
                underline: {
                  type: block.style.underline ? 'single' : 'none'
                }
              })
            ],
            style: block.style.font
          }))
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'corrected-document.docx';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      this.error = 'Error downloading document: ' + (err as Error).message;
    }
  }

  downloadAnalysis(): void {
    try {
      const data = this.blocks.map(block => ({
        'Block ID': block.id,
        'Text': block.text,
        'Font': block.style.font,
        'Size': block.style.size,
        'Issues': block.spellIssues.map(issue => 
          `${issue.type}: ${issue.word} -> ${issue.suggestion}`
        ).join('; ')
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis');
      
      XLSX.writeFile(workbook, 'document-analysis.xlsx');
    } catch (err) {
      this.error = 'Error exporting analysis: ' + (err as Error).message;
    }
  }
} 