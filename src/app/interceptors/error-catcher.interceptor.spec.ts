import { SnackBarComponent } from './../components/snack-bar/snack-bar.component';
import { AppModule } from './../app.module';
import { AppComponent } from './../app.component';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ErrorCatcherInterceptor } from './error-catcher.interceptor';
import { By } from '@angular/platform-browser';
import environment from 'src/environments/environment';

describe('ErrorCatcherInterceptor', () => {
  let testUrl: string = '';
  let controller: HttpTestingController;
  let client: HttpClient;
  let component: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, AppModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorCatcherInterceptor,
          multi: true,
        },
      ],
    }).compileComponents();
    controller = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
    component = TestBed.createComponent(AppComponent);
    component.detectChanges();
  });

  afterEach(() => {
    controller.verify();
  });

  it(`check error catcher creates SnackBarComponent with error`, (done) => {
    const debug = component.debugElement;
    client.get('').subscribe({
      next: fail,
      error: () => {
        const snackBar: SnackBarComponent = debug.query(
          By.directive(SnackBarComponent)
        ).componentInstance;
        expect(snackBar.error).toEqual('test');
      },
    }).add(done);

    const req = controller.expectOne(environment.baseUrl);

    req.flush('', { status: 500, statusText: 'test', headers: { error: 'test' }});
  });
});
