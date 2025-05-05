import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { renderAsync } from 'docx-preview';

@Component({
  selector: 'app-docx-viewer',
  templateUrl: './docx-viewer.component.html',
  styleUrls: ['./docx-viewer.component.css']
})
export class DocxViewerComponent implements OnInit, AfterViewInit {
  files: string[] = [];
  selectedFile: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  @ViewChild('docxContainer') docxContainer!: ElementRef;

  constructor() {
    console.log('DocxViewerComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit: Starting to load docx files');
    this.loadDocxFiles();
  }

  ngAfterViewInit() {
    console.log('docxContainer initialized:', !!this.docxContainer);
  }

  loadDocxFiles() {
    console.log('loadDocxFiles: Starting to load files list');
    this.isLoading = true;
    this.error = null;

    try {
      // Static list of files in the assets/docx-templates directory
      this.files = ['sample1.docx', 'sample2.docx'];
      console.log('loadDocxFiles: Loaded files:', this.files);
      this.isLoading = false;
    } catch (error) {
      console.error('loadDocxFiles: Error loading files:', error);
      this.error = 'Không thể tải danh sách file. Vui lòng thử lại.';
      this.isLoading = false;
    }
  }

  async loadDocxContent(fileName: string) {
    console.log('Step 1: Starting to load content for file:', fileName);
    this.isLoading = true;
    this.error = null;
    this.selectedFile = fileName;

    try {
      // Ensure container exists
      if (!this.docxContainer?.nativeElement) {
        console.error('Container not found, retrying in 100ms');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.docxContainer?.nativeElement) {
          throw new Error('Document container not initialized');
        }
      }

      // Clear previous content
      this.docxContainer.nativeElement.innerHTML = '';

      // Fetch the file
      const response = await fetch(`assets/docx-templates/${fileName}`);
      console.log('Step 2: File fetch response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the file as array buffer
      const arrayBuffer = await response.arrayBuffer();
      console.log('Step 3: File loaded successfully, size:', arrayBuffer.byteLength, 'bytes');

      // Render the document
      console.log('Step 4: Starting document rendering');
      await renderAsync(arrayBuffer, this.docxContainer.nativeElement, null, {
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
        renderHeaders: true,
      });
      console.log('Step 5: Document rendered successfully');

      this.isLoading = false;
    } catch (error) {
      console.error('Error loading document:', error);
      this.error = 'Không thể tải hoặc hiển thị file';
      this.isLoading = false;
    }
  }
}
