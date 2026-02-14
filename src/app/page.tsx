"use client";

import { useState } from "react";
import Image from "next/image";

const players = [
	{
		name: "Srikar",
		img: "/srikar.jpeg",
		winImg: "/rhea_funny.jpeg",
	},
	{
		name: "Rhea",
		img: "/rhea.jpeg",
		winImg: "/srikar_funny.jpeg",
	},
];

function PlayerSelect({ onSelect }: { onSelect: (p: number) => void }) {
	return (
		<div className="flex flex-col items-center gap-8">
			<h1 className="text-4xl font-bold text-pink-600 mb-4">
				Valentine’s Tic Tac Toe
			</h1>
			<p className="text-lg text-zinc-700 mb-2">Who are you?</p>
			<div className="flex gap-8">
				{players.map((p, i) => (
					<button
						key={p.name}
						className="flex flex-col items-center hover:scale-105 transition-transform"
						onClick={() => onSelect(i)}
					>
						<Image
							src={p.img}
							alt={p.name}
							width={100}
							height={100}
							className="rounded-full border-4 border-pink-300 shadow-lg"
						/>
						<span className="mt-2 text-xl font-semibold text-pink-500">
							{p.name}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}

function checkWinner(board: number[][]) {
	const lines = [
		// rows
		[
			[0, 0],
			[0, 1],
			[0, 2],
		],
		[
			[1, 0],
			[1, 1],
			[1, 2],
		],
		[
			[2, 0],
			[2, 1],
			[2, 2],
		],
		// cols
		[
			[0, 0],
			[1, 0],
			[2, 0],
		],
		[
			[0, 1],
			[1, 1],
			[2, 1],
		],
		[
			[0, 2],
			[1, 2],
			[2, 2],
		],
		// diags
		[
			[0, 0],
			[1, 1],
			[2, 2],
		],
		[
			[0, 2],
			[1, 1],
			[2, 0],
		],
	];
	for (let l of lines) {
		const [a, b, c] = l;
		if (
			board[a[0]][a[1]] !== -1 &&
			board[a[0]][a[1]] === board[b[0]][b[1]] &&
			board[a[0]][a[1]] === board[c[0]][c[1]]
		) {
			return board[a[0]][a[1]];
		}
	}
	return null;
}

function Board({
	playerIdx,
	onWin,
}: {
	playerIdx: number;
	onWin: (winner: number) => void;
}) {
	const [board, setBoard] = useState(
		Array(3)
			.fill(null)
			.map(() => Array(3).fill(-1))
	);
	const [turn, setTurn] = useState(playerIdx);
	const [winner, setWinner] = useState<number | null>(null);
	const [moves, setMoves] = useState(0);

	function handleClick(r: number, c: number) {
		if (board[r][c] !== -1 || winner !== null) return;
		const newBoard = board.map((row) => [...row]);
		newBoard[r][c] = turn;
		setBoard(newBoard);
		setMoves((m) => m + 1);
		const win = checkWinner(newBoard);
		if (win !== null) {
			setWinner(win);
			onWin(win);
		} else if (moves + 1 === 9) {
			setWinner(-2); // draw
		} else {
			setTurn(1 - turn);
		}
	}

	function reset() {
		setBoard(
			Array(3)
				.fill(null)
				.map(() => Array(3).fill(-1))
		);
		setTurn(playerIdx);
		setWinner(null);
		setMoves(0);
	}

	return (
		<div className="flex flex-col items-center gap-6">
			<h2 className="text-2xl font-bold text-pink-500 mb-2">
				{winner === null
					? `${players[turn].name}'s turn`
					: winner === -2
					? "It’s a draw!"
					: `${players[winner].name} wins!`}
			</h2>
			<div className="grid grid-cols-3 gap-2 bg-pink-100 p-4 rounded-xl shadow-lg">
				{board.map((row, r) =>
					row.map((cell, c) => (
						<button
							key={r + "-" + c}
							className="w-24 h-24 flex items-center justify-center bg-white rounded-lg border-2 border-pink-300 hover:bg-pink-50 transition-all"
							onClick={() => handleClick(r, c)}
							disabled={cell !== -1 || winner !== null}
						>
							{cell !== -1 && (
								<Image
									src={players[cell].img}
									alt={players[cell].name}
									width={60}
									height={60}
									className="rounded-full"
								/>
							)}
						</button>
					))
				)}
			</div>
			<button
				onClick={reset}
				className="mt-4 px-6 py-2 rounded-full bg-pink-400 text-white font-semibold shadow hover:bg-pink-500"
			>
				Restart
			</button>
		</div>
	);
}

export default function Home() {
	const [selected, setSelected] = useState<number | null>(null);
	const [showWinImg, setShowWinImg] = useState<number | null>(null);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 to-pink-300 font-sans">
			<main className="flex flex-col items-center w-full max-w-2xl p-8 rounded-2xl shadow-2xl bg-white/80 border border-pink-200">
				{selected === null ? (
					<PlayerSelect onSelect={setSelected} />
				) : showWinImg !== null ? (
					<div className="flex flex-col items-center gap-6">
						<h2 className="text-3xl font-bold text-pink-600">
							{players[showWinImg].name} wins!
						</h2>
						<Image
							src={players[showWinImg].winImg}
							alt="Funny"
							width={200}
							height={200}
							className="rounded-2xl border-4 border-pink-400 shadow-xl"
						/>
						<button
							onClick={() => {
								setSelected(null);
								setShowWinImg(null);
							}}
							className="mt-4 px-6 py-2 rounded-full bg-pink-400 text-white font-semibold shadow hover:bg-pink-500"
						>
							Play Again
						</button>
					</div>
				) : (
					<Board playerIdx={selected} onWin={(w) => setShowWinImg(w)} />
				)}
			</main>
		</div>
	);
}
