import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { AppComponent } from './app.component';
import { DocxViewerComponent } from './docx-viewer/docx-viewer.component';

const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [
            { path: '', redirectTo: '/docx-viewer', pathMatch: 'full' },
            { path: 'docx-viewer', component: DocxViewerComponent },
            {
                path: 'home',
                loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
                canActivate: [AppRouteGuard]
            },
            {
                path: 'about',
                loadChildren: () => import('./docx-viewer/docx-viewer.module').then((m) => m.DocxViewerModule),
                canActivate: [AppRouteGuard]
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
                data: { permission: 'Pages.Users' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'roles',
                loadChildren: () => import('./roles/roles.module').then((m) => m.RolesModule),
                data: { permission: 'Pages.Roles' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'tenants',
                loadChildren: () => import('./tenants/tenants.module').then((m) => m.TenantsModule),
                data: { permission: 'Pages.Tenants' },
                canActivate: [AppRouteGuard]
            },
            {
                path: 'update-password',
                loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
                canActivate: [AppRouteGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
