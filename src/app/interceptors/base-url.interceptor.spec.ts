import environment from 'src/environments/environment';
import { HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseUrlInterceptor } from './base-url.interceptor'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

describe('BaseUrlInterceptor', () => {
  let request: HttpRequest<any>;
  let next: HttpHandler;
  let testUrl: string;
  let controller: HttpTestingController;
  let client: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BaseUrlInterceptor,
          multi: true
        }
      ],
    })

    testUrl = '/test';
    request = new HttpRequest('GET', testUrl);
    next = {
      handle: () => {
        return new Observable();
      }
    };
    controller = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    controller.verify();
  });

  it(`check url for api starts with ${environment.baseUrl}`, (done) => {
    client.get(testUrl).subscribe().add(done);

    const req = controller.expectOne(`${environment.baseUrl}${testUrl}`);
    expect(req.request.url).toEqual(`${environment.baseUrl}${testUrl}`);

    req.flush('');
  })
})
