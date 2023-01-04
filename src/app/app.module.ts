// components
import { AppComponent } from './app.component';

// modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'
import BaseUrlInterceptor from './interceptors/base-url.interceptor';
import { BitwiseOrPipe } from './pipes/bitwise-or.pipe';
import { BitwiseAndPipe } from './pipes/bitwise-and.pipe';
import { CustomClickDirective } from './directives/custom-click.directive';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { CustomButtonClassDirective } from './directives/custom-button-class.directive';

@NgModule({
  declarations: [
    AppComponent,
    BitwiseOrPipe,
    BitwiseAndPipe,
    CustomClickDirective,
    CalculatorComponent,
    CustomButtonClassDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatGridListModule,
    MatDividerModule,
    MatButtonModule,
    HttpClientModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
