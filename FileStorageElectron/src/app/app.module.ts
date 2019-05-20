import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { FileDropModule } from 'ngx-file-drop';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { UdpService } from './services/udp.service';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProgressComponent } from './components/progress/progress.component';
import {
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatTableModule,
  MatDividerModule,
} from '@angular/material';
import { DownloadComponent } from './components/download/download.component';
import { UploadComponent } from './components/upload/upload.component';
import { SettingsComponent } from './components/settings/settings.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DownloadComponent,
    UploadComponent,
    ProgressComponent,
    SettingsComponent,
    WebviewDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FileDropModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatToolbarModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ElectronService,
    UdpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
