/**
 * Bit field
 *
 * Allows token grouping in primitive manner
 * (some groups are more descriptive and apply rather to single button).
 * Extending this enumeration is allowed to some extent (SPECIAL must have the highest value)
 */
export enum ButtonGroup {
  NONE = 0,
  DOT = 1 << 0,
  NUMBER = 1 << 1,
  UNARY_LEFT = 1 << 2,
  UNARY_RIGHT = 1 << 3,
  BINARY = 1 << 4,
  FUNCTION = 1 << 5,
  CONSTANT = 1 << 6,
  SEPARATOR = 1 << 7,
  OPEN_BRACKET = 1 << 8,
  CLOSE_BRACKET = 1 << 9,
}

export const NextGroup = new Map<ButtonGroup, ButtonGroup>([
  [ButtonGroup.DOT, ButtonGroup.NUMBER],
  [
    ButtonGroup.NUMBER,
    ButtonGroup.UNARY_RIGHT |
      ButtonGroup.BINARY |
      ButtonGroup.NUMBER |
      ButtonGroup.DOT |
      ButtonGroup.SEPARATOR |
      ButtonGroup.CLOSE_BRACKET,
  ],
  [
    ButtonGroup.UNARY_LEFT,
    ButtonGroup.NUMBER |
      ButtonGroup.FUNCTION |
      ButtonGroup.CONSTANT |
      ButtonGroup.UNARY_LEFT |
      ButtonGroup.OPEN_BRACKET,
  ],
  [
    ButtonGroup.UNARY_RIGHT,
    ButtonGroup.UNARY_RIGHT |
      ButtonGroup.BINARY |
      ButtonGroup.SEPARATOR |
      ButtonGroup.CLOSE_BRACKET,
  ],
  [
    ButtonGroup.BINARY,
    ButtonGroup.NUMBER |
      ButtonGroup.UNARY_LEFT |
      ButtonGroup.FUNCTION |
      ButtonGroup.CONSTANT |
      ButtonGroup.OPEN_BRACKET,
  ],
  [ButtonGroup.FUNCTION, ButtonGroup.OPEN_BRACKET],
  [
    ButtonGroup.CONSTANT,
    ButtonGroup.UNARY_RIGHT |
      ButtonGroup.BINARY |
      ButtonGroup.SEPARATOR |
      ButtonGroup.CLOSE_BRACKET,
  ],
  [
    ButtonGroup.SEPARATOR,
    ButtonGroup.NUMBER |
      ButtonGroup.UNARY_LEFT |
      ButtonGroup.FUNCTION |
      ButtonGroup.CONSTANT |
      ButtonGroup.OPEN_BRACKET,
  ],
  [
    ButtonGroup.OPEN_BRACKET,
    ButtonGroup.NUMBER |
      ButtonGroup.UNARY_LEFT |
      ButtonGroup.FUNCTION |
      ButtonGroup.CONSTANT |
      ButtonGroup.OPEN_BRACKET,
  ],
  [
    ButtonGroup.CLOSE_BRACKET,
    ButtonGroup.UNARY_RIGHT |
      ButtonGroup.BINARY |
      ButtonGroup.SEPARATOR |
      ButtonGroup.CLOSE_BRACKET,
  ],
]);
