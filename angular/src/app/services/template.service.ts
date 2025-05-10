import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TemplateContent {
  id: string;
  label: string;
  value: string;
  description: string;
  isMultiple?: boolean;
  items?: string[];
  placeholder: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templateContents = new BehaviorSubject<TemplateContent[]>([
    {
      id: 'report',
      label: 'Báo cáo',
      value: 'Tên báo cáo',
      description: 'Tên báo cáo',
      placeholder: '(1)'
    },
    {
      id: 'basis',
      label: 'Căn cứ',
      value: '',
      description: 'Căn cứ pháp lý',
      isMultiple: true,
      items: [],
      placeholder: '(2)'
    },
    {
      id: 'content',
      label: 'Nội dung',
      value: 'Nội dung báo  cáo',
      description: 'Nội dung chính',
      placeholder: '(3)'
    }
  ]);

  // Expose the BehaviorSubject as an Observable
  templateContents$ = this.templateContents.asObservable();

  getTemplateContents() {
    console.log('Step 1: Getting template contents');
    const contents = this.templateContents.value;
    console.log('Current contents:', contents);
    return contents;
  }

  addBasisItem() {
    console.log('Step 1: Adding new căn cứ item');
    const contents = this.templateContents.value;
    const basisContent = contents.find(c => c.id === 'basis');
    if (basisContent && basisContent.items) {
      console.log('Step 2: Found basis content, current items:', basisContent.items);
      basisContent.items.push('');
      console.log('Step 3: Added new item, updated items:', basisContent.items);
      this.updateBasisValue(basisContent);
      console.log('Step 4: Updated basis value:', basisContent.value);
      this.templateContents.next([...contents]);
      console.log('Step 5: Emitted new contents');
    }
  }

  removeBasisItem(index: number) {
    console.log('Step 1: Removing căn cứ item at index:', index);
    const contents = this.templateContents.value;
    const basisContent = contents.find(c => c.id === 'basis');
    if (basisContent && basisContent.items && basisContent.items.length > 1) {
      console.log('Step 2: Found basis content, current items:', basisContent.items);
      basisContent.items.splice(index, 1);
      console.log('Step 3: Removed item, updated items:', basisContent.items);
      this.updateBasisValue(basisContent);
      console.log('Step 4: Updated basis value:', basisContent.value);
      this.templateContents.next([...contents]);
      console.log('Step 5: Emitted new contents');
    }
  }

  private updateBasisValue(basisContent: TemplateContent) {
    console.log('Step 1: Updating basis value');
    if (basisContent.items) {
      const nonEmptyItems = basisContent.items.filter(item => item.trim());
      console.log('Step 2: Non-empty items:', nonEmptyItems);
      basisContent.value = nonEmptyItems.length > 0 
        ? nonEmptyItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
        : '';
      console.log('Step 3: New basis value:', basisContent.value);
    }
  }

  updateTemplateContent(id: string, value: string, index?: number) {
    console.log('Step 1: Updating template content');
    console.log('Content ID:', id);
    console.log('New value:', value);
    console.log('Item index:', index);

    const contents = this.templateContents.value;
    const content = contents.find(c => c.id === id);
    if (content) {
      if (content.isMultiple && content.items && index !== undefined) {
        console.log('Step 2: Updating multiple item content');
        console.log('Current items:', content.items);
        content.items[index] = value;
        console.log('Updated items:', content.items);
        this.updateBasisValue(content);
        console.log('Step 3: Updated basis value:', content.value);
      } else {
        console.log('Step 2: Updating single item content');
        content.value = value;
        console.log('New value:', content.value);
      }
      this.templateContents.next([...contents]);
      console.log('Step 3: Emitted new contents');
    }
  }

  processTemplateContent(html: string): string {
    console.log('Step 1: Processing template content');
    let processedHtml = html;
    this.templateContents.value.forEach(content => {
      console.log('Processing content:', content.id);
      if (content.isMultiple && content.items) {
        console.log('Step 2: Processing multiple items');
        const nonEmptyItems = content.items.filter(item => item.trim());
        console.log('Non-empty items:', nonEmptyItems);
        if (nonEmptyItems.length > 0) {
          const value = nonEmptyItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
          console.log('Generated value:', value);
          processedHtml = processedHtml.replace(new RegExp(this.escapeRegExp(content.placeholder), 'g'), value);
        } else {
          console.log('No non-empty items, replacing with empty string');
          processedHtml = processedHtml.replace(new RegExp(this.escapeRegExp(content.placeholder), 'g'), '');
        }
      } else {
        console.log('Step 2: Processing single item');
        processedHtml = processedHtml.replace(new RegExp(this.escapeRegExp(content.placeholder), 'g'), content.value);
      }
    });
    console.log('Step 3: Final processed HTML:', processedHtml);
    return processedHtml;
  }

  // Helper function to escape special characters in regex
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
} 