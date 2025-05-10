import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderAsync } from 'docx-preview';
import { TemplateService, TemplateContent } from '../services/template.service';
import { environment } from '../../environments/environment';
import { TemplateFilesService } from '../services/template-files.service';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-docx-viewer',
  templateUrl: './docx-viewer.component.html',
  styleUrls: ['./docx-viewer.component.css']
})
export class DocxViewerComponent implements OnInit, OnDestroy {
  @ViewChild('documentContainer') documentContainer!: ElementRef;
  
  files: { name: string; url: string }[] = [];
  selectedFile: { name: string; url: string } | null = null;
  docxContent: SafeHtml | null = null;
  isLoading = false;
  error: string | null = null;
  isTemplateMode = false;
  originalContent: string | null = null;
  currentArrayBuffer: ArrayBuffer | null = null;
  templateContents: TemplateContent[] = [];
  private templateSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private templateService: TemplateService,
    private templateFilesService: TemplateFilesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadFiles();
    this.templateContents = this.templateService.getTemplateContents();
    
    // Subscribe to template content changes
    this.templateSubscription = this.templateService.templateContents$.subscribe(() => {
      if (this.isTemplateMode && this.originalContent) {
        this.processTemplateContent();
      }
    });
  }

  ngOnDestroy() {
    if (this.templateSubscription) {
      this.templateSubscription.unsubscribe();
    }
  }

  onContentChange(content: TemplateContent, index?: number) {
    this.templateService.updateTemplateContent(content.id, content.value, index);
    // Force immediate update
    if (this.isTemplateMode && this.originalContent) {
      setTimeout(() => {
        this.processTemplateContent();
        this.cdr.detectChanges();
      }, 0);
    }
  }

  addBasisItem() {
    this.templateService.addBasisItem();
    // Force immediate update
    if (this.isTemplateMode && this.originalContent) {
      setTimeout(() => {
        this.processTemplateContent();
        this.cdr.detectChanges();
      }, 0);
    }
  }

  removeBasisItem(index: number) {
    this.templateService.removeBasisItem(index);
    // Force immediate update
    if (this.isTemplateMode && this.originalContent) {
      setTimeout(() => {
        this.processTemplateContent();
        this.cdr.detectChanges();
      }, 0);
    }
  }

  private processTemplateContent() {
    if (this.originalContent) {
      const processedContent = this.templateService.processTemplateContent(this.originalContent);
      this.documentContainer.nativeElement.innerHTML = processedContent;
    }
  }

  toggleTemplateMode() {
    this.isTemplateMode = !this.isTemplateMode;
    if (this.isTemplateMode) {
      // Store original content when switching to template mode
      this.originalContent = this.documentContainer.nativeElement.innerHTML;
      this.processTemplateContent();
    } else {
      // Restore original content when switching back
      if (this.originalContent) {
        this.documentContainer.nativeElement.innerHTML = this.originalContent;
      }
    }
  }

  loadFiles() {
    this.isLoading = true;
    this.error = null;

    this.templateFilesService.getTemplateFiles().subscribe({
      next: (files) => {
        this.files = files.map(fileName => ({
          name: fileName,
          url: this.templateFilesService.getTemplateUrl(fileName)
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading files:', error);
        this.error = 'Failed to load template files';
        this.isLoading = false;
      }
    });
  }

  onFileSelect(file: { name: string; url: string }) {
    this.selectedFile = file;
    this.loadDocxContent(file.url);
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.name.endsWith('.docx')) {
        this.error = 'Please upload a .docx file';
        return;
      }

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

          // Store the array buffer
          this.currentArrayBuffer = arrayBuffer;
          
          // Add the new file to the list
          const newFile = {
            name: file.name,
            url: URL.createObjectURL(file)
          };
          
          // Check if file already exists
          const existingFileIndex = this.files.findIndex(f => f.name === file.name);
          if (existingFileIndex !== -1) {
            this.files[existingFileIndex] = newFile;
          } else {
            this.files.push(newFile);
          }
          
          // Select the newly uploaded file
          this.onFileSelect(newFile);
          
          this.isLoading = false;
          console.log('File uploaded successfully:', file.name);
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

      // Read the file as ArrayBuffer
      reader.readAsArrayBuffer(file);
    }
  }

  removeFile(file: { name: string; url: string }) {
    const index = this.files.findIndex(f => f.name === file.name);
    if (index !== -1) {
      this.files.splice(index, 1);
      if (this.selectedFile?.name === file.name) {
        this.selectedFile = null;
        this.docxContent = null;
      }
    }
  }

  async downloadProcessedFile() {
    if (!this.selectedFile || !this.currentArrayBuffer) {
      this.error = 'No file selected or no content available';
      return;
    }

    try {
      this.isLoading = true;
      const processedFileName = this.selectedFile.name.replace('.docx', '_filled.docx');

      // Get the current content with filled values
      const filledContent = this.templateService.processTemplateContent(
        this.documentContainer.nativeElement.innerHTML
      );

      // Create a temporary container to parse the filled content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = filledContent;

      // Extract paragraphs and create document sections
      const paragraphs = Array.from(tempDiv.querySelectorAll('p')).map(p => {
        return new Paragraph({
          children: [
            new TextRun({
              text: p.textContent || '',
            }),
          ],
        });
      });

      // Create a new document with the filled content
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      // Generate the document as a blob
      const filledBlob = await Packer.toBlob(doc);

      // Create a download link
      const url = URL.createObjectURL(filledBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = processedFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.isLoading = false;
      console.log('Filled document downloaded successfully:', processedFileName);
    } catch (error) {
      console.error('Error downloading file:', error);
      this.error = 'Failed to download file';
      this.isLoading = false;
    }
  }

  private loadDocxContent(url: string) {
    this.isLoading = true;
    this.error = null;
    this.docxContent = null;
    this.originalContent = null;
    this.currentArrayBuffer = null;
    this.isTemplateMode = false;

    console.log('Step 1: Starting to load file from URL:', url);

    this.http.get(url, { responseType: 'arraybuffer' })
      .subscribe({
        next: (arrayBuffer) => {
          console.log('Step 2: File downloaded successfully, size:', arrayBuffer.byteLength);
          this.currentArrayBuffer = arrayBuffer;

          console.log('Step 3: Starting to render document');
          renderAsync(arrayBuffer, this.documentContainer.nativeElement, null, {
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
          }).then(() => {
            console.log('Step 4: Document rendered successfully');
            this.isLoading = false;
            this.cdr.detectChanges();
          }).catch(error => {
            console.error('Step 5: Error rendering document:', error);
            this.error = 'Failed to render document';
            this.isLoading = false;
          });
        },
        error: (error) => {
          console.error('Step 6: Error downloading file:', error);
          this.error = 'Failed to load file';
          this.isLoading = false;
        }
      });
  }

  async generateContentWithAI(prompt: string) {
    if (!this.selectedFile) {
      this.error = 'Please select a template first';
      return;
    }

    try {
      this.isLoading = true;
      const response = await this.http.post(`${environment.apiUrl}/api/openai/generate`, { prompt }).toPromise();
      
      if (response && typeof response === 'object' && 'content' in response) {
        const generatedContent = (response as any).content;
        this.templateService.updateTemplateContent('generated', generatedContent);
        if (this.isTemplateMode) {
          this.processTemplateContent();
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
      this.error = 'Failed to generate content';
    } finally {
      this.isLoading = false;
    }
  }
}
