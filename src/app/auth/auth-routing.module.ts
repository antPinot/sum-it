import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthPageComponent } from "./auth-page/auth-page.component";

const routes: Routes = [
    { path: 'login', component: AuthPageComponent },
    { path: 'register' , component: AuthPageComponent}
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AuthRoutingModule { }