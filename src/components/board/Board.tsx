import { Cell } from "./Cell";

type BoardProps = {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  size: number;
  value: string;
  isGameOver: boolean;
};

export const Board = ({ board, isGameOver, onCellClick, size }: BoardProps) => {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
      {board.map((cellValue, index) => (
        <Cell
          key={index}
          value={cellValue}
          isGameOver={isGameOver}
          onClick={() => onCellClick(index)}
        />
      ))}
    </div>
  );
};
