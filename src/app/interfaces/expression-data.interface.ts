/**
 * Holds additional information for calculation
 */
export interface IExpressionOptions {
  rad?: boolean;
}

/**
 * Holds calculator's history record
 */
export interface IExpressionData {
  expression: string,
  options?: IExpressionOptions
}
