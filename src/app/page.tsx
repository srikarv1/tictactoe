"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const GAME_WIDTH = 320;
const GAME_HEIGHT = 480;
const RHEA_WIDTH = 60;
const RHEA_HEIGHT = 60;
const SRIKAR_WIDTH = 60;
const SRIKAR_HEIGHT = 60;
const MOVE_STEP = 40;
const FALL_SPEED = 4;

function getRandomX() {
	return Math.floor(Math.random() * (GAME_WIDTH - SRIKAR_WIDTH));
}

export default function DodgingGame() {
	const [rheaX, setRheaX] = useState(GAME_WIDTH / 2 - RHEA_WIDTH / 2);
	const [srikars, setSrikars] = useState([
		{ x: getRandomX(), y: -SRIKAR_HEIGHT },
	]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const animationRef = useRef<number | null>(null);

	// Move Srikars down
	useEffect(() => {
		if (gameOver) return;
		function animate() {
			setSrikars((prev) => {
				let next = prev.map((s) => ({ ...s, y: s.y + FALL_SPEED }));
				// Remove Srikars that are out of bounds, add new one if needed
				if (next.length === 0 || next[next.length - 1].y > 100) {
					next.push({ x: getRandomX(), y: -SRIKAR_HEIGHT });
				}
				next = next.filter((s) => s.y < GAME_HEIGHT);
				return next;
			});
			animationRef.current = requestAnimationFrame(animate);
		}
		animationRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationRef.current!);
	}, [gameOver]);

	// Collision detection
	useEffect(() => {
		if (gameOver) return;
		for (const s of srikars) {
			const collide =
				s.y + SRIKAR_HEIGHT > GAME_HEIGHT - RHEA_HEIGHT - 10 &&
				s.y < GAME_HEIGHT - 10 &&
				s.x < rheaX + RHEA_WIDTH &&
				s.x + SRIKAR_WIDTH > rheaX;
			if (collide) {
				setGameOver(true);
				return;
			}
		}
		// Score
		setScore((score) => score + 1);
	}, [srikars, rheaX, gameOver]);

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
		setRheaX((x) => Math.max(0, x - MOVE_STEP));
	}
	function moveRight() {
		setRheaX((x) => Math.min(GAME_WIDTH - RHEA_WIDTH, x + MOVE_STEP));
	}
	function restart() {
		setRheaX(GAME_WIDTH / 2 - RHEA_WIDTH / 2);
		setSrikars([{ x: getRandomX(), y: -SRIKAR_HEIGHT }]);
		setScore(0);
		setGameOver(false);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-pink-300">
			<h1 className="text-3xl font-bold text-pink-600 mb-4">
				Rhea Dodges Srikar!
			</h1>
			<div
				className="relative bg-white border-4 border-pink-300 rounded-xl shadow-lg"
				style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
			>
				{/* Srikars */}
				{srikars.map((s, i) => (
					<Image
						key={i}
						src="/srikar.jpeg"
						alt="Srikar"
						width={SRIKAR_WIDTH}
						height={SRIKAR_HEIGHT}
						style={{
							position: "absolute",
							left: s.x,
							top: s.y,
							transition: "none",
							zIndex: 2,
						}}
					/>
				))}
				{/* Rhea */}
				<Image
					src="/rhea.jpeg"
					alt="Rhea"
					width={RHEA_WIDTH}
					height={RHEA_HEIGHT}
					style={{
						position: "absolute",
						left: rheaX,
						top: GAME_HEIGHT - RHEA_HEIGHT - 10,
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
