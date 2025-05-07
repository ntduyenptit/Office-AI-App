import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateFilesService {
  private readonly templateFiles = [
    'sample1.docx',
    'sample2.docx',
    'sample3.docx'
  ];

  constructor(private http: HttpClient) {}

  getTemplateFiles(): Observable<string[]> {
    return of(this.templateFiles);
  }

  getTemplateUrl(fileName: string): string {
    return `assets/docx-templates/${fileName}`;
  }
} 