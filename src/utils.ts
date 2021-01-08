export const combination = <T>(items: T[]): T[][] =>
  items.flatMap((a, index, array) => array.slice(index + 1).map((b) => [a, b]));
