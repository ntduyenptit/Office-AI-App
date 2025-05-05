import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocxViewerComponent } from './docx-viewer.component';

const routes: Routes = [
    {
        path: '',
        component: DocxViewerComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DocxViewerRoutingModule { }
