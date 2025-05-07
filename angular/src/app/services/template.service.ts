import { Injectable } from '@angular/core';
import { TemplateContent } from '../models/template-content.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templateContents: TemplateContent[] = [
    {
      id: '1',
      placeholder: '(1)',
      label: 'Báo cáo ABC',
      value: '',
      description: 'Tên báo cáo'
    },
    {
      id: '2',
      placeholder: '(2)',
      label: 'Căn cứ',
      value: '',
      description: 'Căn cứ báo cáo'
    },
    {
      id: '3',
      placeholder: '(3)',
      label: 'Nội dung báo cáo',
      value: '',
      description: 'Nội dung bản báo cáo'
    }
    // {
    //   id: '4',
    //   placeholder: '(4)',
    //   label: 'Người kính gửi',
    //   value: 'Giám đốc Trung tâm',
    //   description: 'Người nhận báo cáo'
    // },
    // {
    //   id: '5',
    //   placeholder: '(5)',
    //   label: 'Căn cứ',
    //   value: 'Căn cứ vào các văn bản hướng dẫn của cấp trên',
    //   description: 'Căn cứ pháp lý'
    // },
    // {
    //   id: '6',
    //   placeholder: '(6)',
    //   label: 'Nội dung báo cáo',
    //   value: 'Nội dung báo cáo tổng kết năm 2024 về các hoạt động của Trung tâm như sau.',
    //   description: 'Nội dung chính của báo cáo'
    // },
    // {
    //   id: '7',
    //   placeholder: '(7)',
    //   label: 'Nơi nhận 1',
    //   value: 'Như trên',
    //   description: 'Nơi nhận thứ nhất'
    // },
    // {
    //   id: '8',
    //   placeholder: '(8)',
    //   label: 'Nơi nhận 2',
    //   value: 'A Đức - P.GĐTT',
    //   description: 'Nơi nhận thứ hai'
    // },
    // {
    //   id: '9',
    //   placeholder: '(9)',
    //   label: 'Nơi nhận 3',
    //   value: 'P.NCSP',
    //   description: 'Nơi nhận thứ ba'
    // },
    // {
    //   id: '10',
    //   placeholder: '(10)',
    //   label: 'Tên người ký',
    //   value: 'Lê Xuân Huy',
    //   description: 'Tên người ký báo cáo'
    // }
  ];

  getTemplateContents(): TemplateContent[] {
    return this.templateContents;
  }

  updateTemplateContent(id: string, value: string): void {
    const content = this.templateContents.find(c => c.id === id);
    if (content) {
      content.value = value;
    }
  }

  // Get all replacements
  getReplacements(): { [key: string]: string } {
    return this.templateContents.reduce((acc, content) => {
      acc[content.placeholder] = content.value || content.label;
      return acc;
    }, {} as { [key: string]: string });
  }

  // Process template content while preserving formatting
  processTemplateContent(content: string): string {
    const replacements = this.getReplacements();
    let processedContent = content;

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Process each text node while preserving formatting
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent || '';
        for (const [key, value] of Object.entries(replacements)) {
          if (text.includes(key)) {
            text = text.replace(new RegExp(this.escapeRegExp(key), 'g'), value);
          }
        }
        node.textContent = text;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Process child nodes
        Array.from(node.childNodes).forEach(processNode);
      }
    };

    // Process all nodes
    Array.from(tempDiv.childNodes).forEach(processNode);

    return tempDiv.innerHTML;
  }

  // Helper function to escape special characters in regex
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
} 