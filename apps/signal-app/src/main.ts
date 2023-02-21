import { provideComponentRouter } from '@angular-component/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideComponentRouter()],
}).catch((err) => console.error(err));
