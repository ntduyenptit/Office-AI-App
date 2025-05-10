import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SpellCheckComponent } from './spell-check.component';
import { SpellCheckRoutingModule } from './spell-check-routing.module';
import { SharedModule } from '@shared/shared.module';


@NgModule({
    declarations: [SpellCheckComponent],
    imports: [
        CommonModule,
        SharedModule, 
        SpellCheckRoutingModule
    ]
})
export class SpellCheckModule { } 