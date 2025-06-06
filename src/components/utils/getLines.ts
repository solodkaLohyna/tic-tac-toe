const getHorizontalLines = (size: number) => {
  const array = [];

  for (let i = 0; i < size * size; i++) {
    array.push(i);
  }

  const horizontalLines = [];
  for (let row = 0; row < size; row++) {
    const start = row * size;
    const end = start + size;
    const newLine = array.slice(start, end);
    horizontalLines.push(newLine);
  }
  return horizontalLines;
};

const getVerticalLines = (size: number) => {
  const array = [];

  for (let i = 0; i < size * size; i++) {
    array.push(i);
  }

  const verticalLines = [];
  for (let col = 0; col < size; col++) {
    const newLine: Array<unknown> = [];
    for (let row = 0; row < size; row++) {
      const index = row * size + col;
      newLine.push(array[index]);
    }
    verticalLines.push(newLine);
  }
  return verticalLines;
};

const getDiagonalsLines = (size: number) => {
  const horizontalLines = getHorizontalLines(size);
  const primaryDiagonal: Array<unknown> = [];
  const secondaryDiagonal: Array<unknown> = [];

  for (let i = 0; i < size; i++) {
    primaryDiagonal.push(horizontalLines[i][i]);
    secondaryDiagonal.push(horizontalLines[i][size - 1 - i]);
  }
  return [primaryDiagonal, secondaryDiagonal];
};

export const getAllLines = (size:number) => {
    const lines = [...getHorizontalLines(size), ...getVerticalLines(size), ...getDiagonalsLines(size)];
    return lines;
}