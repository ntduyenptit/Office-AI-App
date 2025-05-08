import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderAsync } from 'docx-preview';
import * as XLSX from 'xlsx';
import { environment } from '../../environments/environment';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-process-file',
  templateUrl: './process-file.component.html',
  styleUrls: ['./process-file.component.css']
})
export class ProcessFileComponent implements OnInit {
  @ViewChild('documentContainer') documentContainer!: ElementRef;
  
  selectedFile: File | null = null;
  docxContent: SafeHtml | null = null;
  isLoading = false;
  error: string | null = null;
  extractedContent: any[] = [];
  currentArrayBuffer: ArrayBuffer | null = null;
  fileType: 'pdf' | 'docx' | null = null;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    // Set up PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.js';
  }

  ngOnInit() {}

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
        this.error = 'Please upload a .docx or .pdf file';
        return;
      }

      this.selectedFile = file;
      this.fileType = file.name.endsWith('.pdf') ? 'pdf' : 'docx';
      this.isLoading = true;
      this.error = null;

      // Read the file as ArrayBuffer
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            throw new Error('Failed to read file');
          }

          this.currentArrayBuffer = arrayBuffer;
          if (this.fileType === 'pdf') {
            this.loadPdfContent(arrayBuffer);
          } else {
            this.loadDocxContent(arrayBuffer);
          }
        } catch (error) {
          console.error('Error processing file:', error);
          this.error = 'Failed to process file';
          this.isLoading = false;
        }
      };

      reader.onerror = () => {
        console.error('Error reading file');
        this.error = 'Failed to read file';
        this.isLoading = false;
      };

      reader.readAsArrayBuffer(file);
    }
  }

  private async loadPdfContent(arrayBuffer: ArrayBuffer) {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const extractedText: string[] = [];

      // Extract text from each page
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim();
        extractedText.push(pageText);
      }

      // Display PDF content
      this.documentContainer.nativeElement.innerHTML = extractedText
        .map((text, index) => `<div class="pdf-page"><h4>Page ${index + 1}</h4><p>${text}</p></div>`)
        .join('');

      // Extract content for Excel export
      this.extractedContent = extractedText.map((text, index) => ({
        id: index + 1,
        content: text,
        page: index + 1
      }));

      this.isLoading = false;
    } catch (error) {
      console.error('Error rendering PDF:', error);
      this.error = 'Failed to render PDF document';
      this.isLoading = false;
    }
  }

  private async loadDocxContent(arrayBuffer: ArrayBuffer) {
    try {
      await renderAsync(arrayBuffer, this.documentContainer.nativeElement, null, {
        className: 'docx-container',
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        useBase64URL: true,
        renderEndnotes: true,
        renderFootnotes: true,
        renderFooters: true,
        renderHeaders: true
      });

      this.extractContent();
      this.isLoading = false;
    } catch (error) {
      console.error('Error rendering document:', error);
      this.error = 'Failed to render document';
      this.isLoading = false;
    }
  }

  private extractContent() {
    if (!this.documentContainer) return;

    const content = this.documentContainer.nativeElement.innerHTML;
    // Extract content based on your requirements
    const paragraphs = Array.from(this.documentContainer.nativeElement.querySelectorAll('p')) as HTMLElement[];
    
    this.extractedContent = paragraphs.map((p, index) => ({
      id: index + 1,
      content: p.textContent?.trim() || '',
      page: Math.floor(index / 10) + 1 // Approximate page number
    }));
  }

  downloadExcel() {
    if (this.extractedContent.length === 0) {
      this.error = 'No content to export';
      return;
    }

    try {
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(this.extractedContent);
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Extracted Content');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create blob and download
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'extracted_content.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      this.error = 'Failed to export to Excel';
    }
  }
} 