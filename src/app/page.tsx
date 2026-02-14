"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 480;
const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 80;
const FALL_WIDTH = 60;
const FALL_HEIGHT = 60;
const MOVE_STEP = 50;
const FALL_SPEED = 2;
const OG_PROB = 0.7; // 70% chance for OG, 30% for Rhea

function getRandomX() {
	return Math.floor(Math.random() * (GAME_WIDTH - FALL_WIDTH));
}

function getRandomFaller() {
	if (Math.random() < OG_PROB) {
		return { type: "og", x: getRandomX(), y: -FALL_HEIGHT };
	} else {
		return { type: "rhea", x: getRandomX(), y: -FALL_HEIGHT };
	}
}

export default function SrikarLovesOtherGirls() {
	const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
	const [fallers, setFallers] = useState([getRandomFaller()]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const animationRef = useRef<number | null>(null);

	// Move fallers down
	useEffect(() => {
		if (gameOver) return;
		function animate() {
			setFallers((prev) => {
				let next = prev.map((f) => ({ ...f, y: f.y + FALL_SPEED }));
				// Add new faller if needed
				if (next.length === 0 || next[next.length - 1].y > 100) {
					next.push(getRandomFaller());
				}
				next = next.filter((f) => f.y < GAME_HEIGHT);
				return next;
			});
			animationRef.current = requestAnimationFrame(animate);
		}
		animationRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationRef.current!);
	}, [gameOver]);

	// Collision detection and scoring
	useEffect(() => {
		if (gameOver) return;
		setFallers((prev) => {
			let updated = [];
			for (const f of prev) {
				const collide =
					f.y + FALL_HEIGHT > GAME_HEIGHT - PLAYER_HEIGHT - 10 &&
					f.y < GAME_HEIGHT - 10 + PLAYER_HEIGHT &&
					f.x < playerX + PLAYER_WIDTH &&
					f.x + FALL_WIDTH > playerX;
				if (collide) {
					if (f.type === "og") {
						setScore((s) => s + 1);
						// OG collected, don't add to updated
						continue;
					} else if (f.type === "rhea") {
						setGameOver(true);
						return updated; // End game
					}
				}
				updated.push(f);
			}
			return updated;
		});
	}, [fallers, playerX, gameOver]);

	// Keyboard controls
	useEffect(() => {
		if (gameOver) return;
		function handleKey(e: KeyboardEvent) {
			if (e.key === "ArrowLeft") moveLeft();
			if (e.key === "ArrowRight") moveRight();
		}
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [gameOver]);

	function moveLeft() {
		setPlayerX((x) => Math.max(0, x - MOVE_STEP));
	}
	function moveRight() {
		setPlayerX((x) => Math.min(GAME_WIDTH - PLAYER_WIDTH, x + MOVE_STEP));
	}
	function restart() {
		setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
		setFallers([getRandomFaller()]);
		setScore(0);
		setGameOver(false);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-pink-300">
			<h1 className="text-3xl font-bold text-pink-600 mb-4">
				Srikar Loves OTHER GIRLS
			</h1>
			<p className="mb-2 text-lg text-pink-700">
				Collect OGs for points, dodge Rhea!
			</p>
			<div
				className="relative bg-white border-4 border-pink-300 rounded-xl shadow-lg"
				style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
			>
				{/* Fallers */}
				{fallers.map((f, i) =>
					f.type === "og" ? (
						<div
							key={i}
							style={{
								position: "absolute",
								left: f.x,
								top: f.y,
								width: FALL_WIDTH,
								height: FALL_HEIGHT,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontWeight: "bold",
								fontSize: 28,
								color: "#fff",
								background: "#f472b6",
								borderRadius: 12,
								boxShadow: "0 2px 8px #f472b6aa",
								zIndex: 2,
							}}
						>
							OG
						</div>
					) : (
						<Image
							key={i}
							src="/rhea.jpeg"
							alt="Rhea"
							width={FALL_WIDTH}
							height={FALL_HEIGHT}
							style={{
								position: "absolute",
								left: f.x,
								top: f.y,
								transition: "none",
								zIndex: 2,
							}}
						/>
					)
				)}
				{/* Srikar */}
				<Image
					src="/srikar.jpeg"
					alt="Srikar"
					width={PLAYER_WIDTH}
					height={PLAYER_HEIGHT}
					style={{
						position: "absolute",
						left: playerX,
						top: GAME_HEIGHT - PLAYER_HEIGHT - 10,
						transition: "left 0.1s",
						zIndex: 3,
					}}
				/>
				{/* Game Over Overlay */}
				{gameOver && (
					<div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
						<h2 className="text-2xl font-bold text-pink-600 mb-2">
							Game Over!
						</h2>
						<p className="mb-4 text-lg">Score: {score}</p>
						<button
							onClick={restart}
							className="px-6 py-2 rounded-full bg-pink-400 text-white font-semibold shadow hover:bg-pink-500"
						>
							Play Again
						</button>
					</div>
				)}
			</div>
			<div className="flex gap-8 mt-6">
				<button
					onClick={moveLeft}
					className="px-6 py-2 rounded-full bg-pink-400 text-white font-semibold shadow hover:bg-pink-500"
				>
					⬅️ Left
				</button>
				<button
					onClick={moveRight}
					className="px-6 py-2 rounded-full bg-pink-400 text-white font-semibold shadow hover:bg-pink-500"
				>
					Right ➡️
				</button>
			</div>
			<div className="mt-4 text-lg font-semibold text-pink-700">
				Score: {score}
			</div>
		</div>
	);
}
