import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpellCheckComponent } from './spell-check.component';

const routes: Routes = [
    {
        path: '',
        component: SpellCheckComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SpellCheckRoutingModule { }
