import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocxViewerComponent } from './docx-viewer.component';

describe('DocxViewerComponent', () => {
  let component: DocxViewerComponent;
  let fixture: ComponentFixture<DocxViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocxViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocxViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
