import type { Player as PlayerProps } from "@/types/Player";

export const Player = ({
  id,
  symbol,
  score,
  isCurrent,
  time,
  moveTime = 0,
}: PlayerProps & { moveTime?: number }) => {
  return (
    <div>
      <p
        className={`${
          isCurrent ? "font-bold" : "font-normal text-gray-500 w-max"
        }`}
      >
        PLAYER {id} - {symbol} {isCurrent && <span>TURN</span>}
      </p>
      <p className={`${isCurrent ? "font-bold" : "font-normal"}`}>
        TIME: {time + (isCurrent ? moveTime : 0)}s
      </p>
      <p>Score: </p>
      {score.length > 0 &&
        score.map((entry, index) => (
          <span key={index} className="text-gray-500 flex flex-col">
            {entry.size ? `${entry.size}x${entry.size} - ${entry.score}` : null}
          </span>
        ))}
    </div>
  );
};
