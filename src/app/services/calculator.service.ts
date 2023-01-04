import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { IExpressionData } from '../interfaces/expression-data.interface';
import IExpressionRecord from '../interfaces/expression-record.interface';

/**
 * Communicates with backend
 */
@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  constructor(private __httpClient: HttpClient) {}

  /**
   * Sends POST request with expression
   *
   * @param expression Expression to be send
   * @returns Observable with calculation result
   */
  evaluate(expression: IExpressionData): Observable<string> {
    return expression.expression.length === 0
      ? throwError(() => 'Empty expression has been sent')
      : this.__httpClient
          .post('/evaluate', expression, { responseType: 'text' })
          .pipe(map((r: string) => r || '0'));
  }

  /**
   * Sends GET request
   *
   * @returns Observable with calculator's history records (up to count)
   */
  history(count: number = 10): Observable<IExpressionRecord[]> {
    return count < 1
      ? throwError(() => 'Count must be a positive integer')
      : this.__httpClient
          .get<IExpressionRecord[]>('/history')
          .pipe(map((r: IExpressionRecord[]) => r.slice(0, count)));
  }
}
