//Hooks and utils
import { useEffect, useRef, useState } from "react";
import { getAllLines } from "./components/utils/getLines";

//Components
import { Player } from "./components/player/Player";
import { Board } from "./components/board/Board";

//UI Components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";
import JSConfetti from "js-confetti";
import { Button } from "./components/ui/button";

//Icons
import { RotateCcw } from "lucide-react";

//Data
import { playersData } from "./data/players";

//Types
import type { Player as PlayerType } from "@/types/Player";

const jsConfetti = new JSConfetti();

function App() {
  const [size, setSize] = useState(3);
  const [board, setBoard] = useState<(string | null)[]>(
    Array(size * size).fill(null)
  );
  const [totalScore, setTotalScore] = useState(0);
  const [players, setPlayers] = useState(playersData);

  const [currentPlayer, setCurrentPlayer] = useState(playersData[0]);

  const [isGameOver, setIsGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [pendingSize, setPendingSize] = useState(size);

  const [moveTime, setMoveTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsGameOver(true);
  }, []);

  const unpdatePlayerScore = (player: PlayerType) => {
    const found = player.score.find((entry) => entry.size === size);

    if (found && typeof found.score === "number") {
      found.score += 1;
    } else {
      player.score.push({ size: size, score: 1 });
    }

    setPlayers((prevPlayers) =>
      prevPlayers.map((p) =>
        p.id === player.id ? { ...p, score: player.score } : p
      )
    );
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setMoveTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleCellClick = (index: number) => {
    if (board[index] !== null || isGameOver) return;

    const updatedBoard = [...board];
    updatedBoard[index] = currentPlayer.symbol;

    setBoard(updatedBoard);

    const winner = checkWinner(updatedBoard);

    if (winner) {
      jsConfetti.addConfetti();
      setTotalScore((prev) => prev + 1);
      setIsGameOver(true);
      setTimeout(() => {
        setShowModal(true);
      }, 2000);
      stopTimer();
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) =>
          p.id === currentPlayer.id ? { ...p, time: p.time + moveTime } : p
        )
      );
      const player = { ...currentPlayer };
      unpdatePlayerScore(player);
      return;
    }

    const isDraw = updatedBoard.every((cell) => cell !== null);
    if (isDraw) {
      setTotalScore((prev) => prev + 1);
      setIsGameOver(true);
      setIsDraw(true);
      stopTimer();
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) =>
          p.id === currentPlayer.id ? { ...p, time: p.time + moveTime } : p
        )
      );
      setTimeout(() => {
        setShowModal(true);
      }, 2000);

      return;
    }

    stopTimer();
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) =>
        p.id === currentPlayer.id ? { ...p, time: p.time + moveTime } : p
      )
    );
    setMoveTime(0);

    const nextPlayer =
      currentPlayer.id === players[0].id ? players[1] : players[0];
    setCurrentPlayer(nextPlayer);

    startTimer();
  };

  const checkWinner = (boardToCheck: (string | null)[]) => {
    for (const line of getAllLines(size) as number[][]) {
      const firstSymbol = boardToCheck[line[0]];
      if (!firstSymbol) continue;

      const isWinningLine = line.every(
        (index) => boardToCheck[index] === firstSymbol
      );

      if (isWinningLine) {
        return firstSymbol;
      }
    }

    return null;
  };

  const handeNewGame = () => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => ({ ...p, time: 0 }))
    );
    setMoveTime(0);
    startTimer();
    setSize(pendingSize);
    setBoard(Array(pendingSize * pendingSize).fill(null));
    setIsGameOver(false);
    setShowModal(false);
    setIsDraw(false);
    setCurrentPlayer(players[0]);
  };

  const changeBoardSize = (newSize: number) => {
    setPendingSize(newSize);

    const isEmptyBoard = board.every((cell) => cell === null);
    if (isEmptyBoard) {
      setSize(newSize);
      setBoard(Array(newSize * newSize).fill(null));
      setIsGameOver(false);
      setShowModal(false);
      setIsDraw(false);
      setCurrentPlayer(players[0]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center font-bold">TIC-TAC-TOE</h1>
      <div className="flex justify-between text-2xl items-start mt-8">
        <Player
          id={players[0].id}
          symbol={players[0].symbol}
          score={players[0].score}
          time={players[0].time}
          isCurrent={currentPlayer.id === players[0].id}
          moveTime={currentPlayer.id === players[0].id ? moveTime : 0}
        />

        <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 gap-2">
          <div className="flex space-x-2">
            <p>BOARD</p>
            <Select
              onValueChange={(value) => changeBoardSize(Number(value))}
              value={pendingSize.toString()}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="3">3x3</SelectItem>
                  <SelectItem value="4">4x4</SelectItem>
                  <SelectItem value="5">5x5</SelectItem>
                  <SelectItem value="6">6x6</SelectItem>
                  <SelectItem value="7">7x7</SelectItem>
                  <SelectItem value="8">8x8</SelectItem>
                  <SelectItem value="9">9x9</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={handeNewGame} variant="outline">
              NEW GAME
              <RotateCcw />
            </Button>
          </div>

          <Board
            board={board}
            onCellClick={handleCellClick}
            size={size}
            value={currentPlayer.symbol}
            isGameOver={isGameOver}
          />

          <p>Games played: {totalScore}</p>
        </div>

        <Player
          id={players[1].id}
          symbol={players[1].symbol}
          score={players[1].score}
          time={players[1].time}
          isCurrent={currentPlayer.id === players[1].id}
          moveTime={currentPlayer.id === players[1].id ? moveTime : 0}
        />
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!isDraw ? "🎉 Congratulation!" : "It's Draw!"}
            </DialogTitle>
          </DialogHeader>
          <p>
            {!isDraw
              ? `Player ${currentPlayer.id} (${currentPlayer.symbol}) win with time ${currentPlayer.time} second!`
              : "Draw! Try again!"}
          </p>
          <DialogFooter>
            <button
              onClick={() => {
                setShowModal(false);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              OK
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
