import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ErrorCatcherInterceptor } from './error-catcher.interceptor';
import environment from 'src/environments/environment';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { AppModule } from '../app.module';

describe('ErrorCatcherInterceptor', () => {
  let error: string = 'testing error';
  let controller: HttpTestingController;
  let client: HttpClient;
  let container: OverlayContainer;

  beforeEach(waitForAsync(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OverlayModule, AppModule],
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
  }));

  beforeEach(inject([OverlayContainer], (c: OverlayContainer) => {
    container = c;
  }));

  afterEach(() => {
    controller.verify();
  });

  it(`check error catcher creates SnackBarComponent with error`, (done) => {
    client
      .get('')
      .subscribe({
        next: fail,
        error: () => {
          const snackBar = container
            .getContainerElement()
            .querySelector('app-snack-bar');
          expect(snackBar).toBeTruthy();
          const main = snackBar?.querySelector('.bar__error');
          expect(main).toBeTruthy();
          const message = main?.firstChild;
          expect(message).toBeTruthy();
          expect(message?.textContent?.trim()).toEqual(error);
        },
      })
      .add(done);

    const req = controller.expectOne(environment.baseUrl);

    req.flush(error, { status: 500, statusText: 'Server error' });
  });
});
