import { Routes } from '@angular/router';

import { MenuComponent } from '../menu/menu.component';
import { DishdetailComponent } from '../dishdetail/dishdetail.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HomeComponent } from '../home/home.component';
import { ContactComponent } from '../contact/contact.component';
import { AboutComponent } from '../about/about.component';


export const routes: Routes = [
  {path: 'home' , component: HomeComponent},
  {path: 'menu' , component: MenuComponent},
  {path: 'contact' , component: ContactComponent},
  { path: 'about', component: AboutComponent },
  { path: 'dishdetail/:id', component: DishdetailComponent },
  {path: '' , redirectTo: '/home' , pathMatch : 'full'},


]
