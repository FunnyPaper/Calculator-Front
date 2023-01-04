import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';
import IExpressionRecord from '../interfaces/expression-record.interface';

describe('CalculatorService', () => {
  let httpTestingController: HttpTestingController;
  let calculatorService: CalculatorService;
  let path: string;
  let method: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CalculatorService],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    calculatorService = TestBed.inject(CalculatorService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(calculatorService).toBeTruthy();
  });

  describe('POST /evaluate', () => {
    beforeEach(() => {
      path = '/evaluate';
      method = 'POST'
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('should return expression result', () => {
      const expression: string = '2+2*2';
      const expectation: string = '6';

      calculatorService
        .evaluate({ expression, options: { rad: true } })
        .subscribe({
          next: (result) => expect(result).toEqual(expectation),
          error: fail,
        });

      const req = httpTestingController.expectOne(path);
      expect(req.request.method).toEqual(method);

      req.flush(expectation);
    });

    it('should return 0 if result is empty', () => {
      const expression: string = '0';
      const expectation: string = '0';
      const response: string = '0';

      calculatorService.evaluate({ expression }).subscribe({
        next: (result) => expect(result).toEqual(expectation),
        error: fail,
      });

      const req = httpTestingController.expectOne(path);
      expect(req.request.method).toEqual(method);

      req.flush(response);
    });

    it('should return Error Observable if expression was empty', () => {
      const expression: string = '';

      calculatorService.evaluate({ expression }).subscribe({
        next: fail,
        error: (e) => expect(e).toEqual('Empty expression has been sent'),
      });

      httpTestingController.expectNone(path);
    });
  });

  describe('GET /history', () => {
    let records: IExpressionRecord[];

    beforeEach(() => {
      path = '/history';
      method = 'GET';
      records = [
        { expression: '2+2', result: '4'},
        { expression: '2*2', result: '4'},
        { expression: '2-2', result: '0'},
        { expression: '2!', result: '2'},
        { expression: '-2', result: '-2'},
        { expression: '2+2', result: '4'},
        { expression: '2*2', result: '4'},
        { expression: '2-2', result: '0'},
        { expression: '2!', result: '2'},
        { expression: '-2', result: '-2'},
        { expression: '-2', result: '-2'},
      ];
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('should return be equal', () => {
      calculatorService
        .history(records.length)
        .subscribe({
          next: (r: IExpressionRecord[]) => expect(r).toEqual(records),
          error: fail,
        });

      const req = httpTestingController.expectOne(path);
      expect(req.request.method).toEqual(method);

      req.flush(records);
    });

    it('should return 5 elements', () => {
      calculatorService
        .history(5)
        .subscribe({
          next: (r: IExpressionRecord[]) => expect(r.length).toEqual(5),
          error: fail,
        });

      const req = httpTestingController.expectOne(path);
      expect(req.request.method).toEqual(method);

      req.flush(records);
    });

    it('should return 10 elements if count is unspecified', () => {
      calculatorService
        .history()
        .subscribe({
          next: (r: IExpressionRecord[]) => expect(r.length).toEqual(10),
          error: fail,
        });

      const req = httpTestingController.expectOne(path);
      expect(req.request.method).toEqual(method);

      req.flush(records);
    });

    it('should return entire history if it\'s less than specified count', () => {
      calculatorService
        .history(records.length * 2)
        .subscribe({
          next: (r: IExpressionRecord[]) => expect(r.length).toEqual(records.length),
          error: fail,
        });

      const req = httpTestingController.expectOne(path);
      expect(req.request.method).toEqual(method);

      req.flush(records);
    });

    it('should return Observable Error if count is non positive', () => {
      calculatorService
        .history(-1)
        .subscribe({
          next: fail,
          error: (e) => expect(e).toEqual('Count must be a positive integer'),
        });

      httpTestingController.expectNone(path);
    });
  });
});
