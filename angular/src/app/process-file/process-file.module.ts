import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProcessFileComponent } from './process-file.component';

const routes: Routes = [
    {
        path: '',
        component: ProcessFileComponent
    }
];

@NgModule({
    declarations: [
        ProcessFileComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class ProcessFileModule { } 