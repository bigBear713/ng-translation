import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';

import { AppService } from './app.service';

const routes: Routes = [
  {
    path: '',
    resolve: {
      defalutLangLoadOver: AppService
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./feature1/feature1.module').then(m => m.Feature1Module)
      },
      {
        path: 'standalone',
        loadChildren: () => import('./feature2/feature2.component').then(m => m.routes)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: "enabledBlocking"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
