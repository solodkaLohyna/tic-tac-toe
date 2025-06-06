export type Player = {
    id: number;
    symbol: string;
    score: { size?: number; score?: number }[];
    isCurrent: boolean;
    time: number;
};