import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DocxViewerRoutingModule } from './docx-viewer-routing.module';
import { DocxViewerComponent } from './docx-viewer.component';

@NgModule({
    declarations: [DocxViewerComponent],
    imports: [
        CommonModule,
        SharedModule, 
        DocxViewerRoutingModule
    ],
})
export class DocxViewerModule { }
// This module imports the SharedModule and DocxViewerRoutingModule, and declares the DocxViewerComponent.