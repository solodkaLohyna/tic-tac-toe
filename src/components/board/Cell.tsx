type CellProps = {
    value: string | null;
    isGameOver: boolean;
    onClick: () => void;
}

export const Cell = ({ value, isGameOver, onClick }: CellProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 border text-2xl flex items-center justify-center ${isGameOver ? "opacity-50 cursor-not-allowed" : " cursor-pointer"}`}
      disabled={isGameOver}
    >
      {value}
    </button>
  );
};