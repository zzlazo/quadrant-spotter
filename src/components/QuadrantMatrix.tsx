import React, { useRef } from "react";
import type { Spot } from "@/infrastructure/models/quadrantModels";
import type { MoveSpotProps } from "@/types/quadrantTypes";

interface QuadrantMatrixProps {
	xLabel?: string;
	yLabel?: string;
	onMoved: ({ id, newX, newY }: MoveSpotProps) => void;
	spots: Spot[];
	selectedSpotId?: number;
	onTapSpot: (id: number) => void;
}

export default function QuadrantMatrix({
	xLabel,
	yLabel,
	onMoved,
	spots,
	selectedSpotId,
	onTapSpot,
}: QuadrantMatrixProps) {
	const matrixSize = 340;
	const matrixRef = useRef<HTMLDivElement>(null);

	const calculateCoordinates = (clientX: number, clientY: number) => {
		if (!matrixRef.current) return null;

		const rect = matrixRef.current.getBoundingClientRect();

		let x = ((clientX - rect.left) / rect.width) * 100;
		// Y軸のパーセンテージ計算 (下端 0% 〜 上端 100% ※ブラウザ座標は上が0なので反転させる)
		let y = (1 - (clientY - rect.top) / rect.height) * 100;

		x = Math.max(0, Math.min(100, Math.round(x)));
		y = Math.max(0, Math.min(100, Math.round(y)));

		return { x, y };
	};

	const handleStart = (spot: Spot, clientX: number, clientY: number) => {
		onTapSpot(spot.id);

		const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
			const curX =
				"touches" in moveEvent
					? moveEvent.touches[0].clientX
					: moveEvent.clientX;
			const curY =
				"touches" in moveEvent
					? moveEvent.touches[0].clientY
					: moveEvent.clientY;

			const coords = calculateCoordinates(curX, curY);
			if (coords) {
				onMoved({ id: spot.id, newX: coords.x, newY: coords.y });
			}
		};

		const handleEnd = () => {
			window.removeEventListener("mousemove", handleMove);
			window.removeEventListener("mouseup", handleEnd);
			window.removeEventListener("touchmove", handleMove);
			window.removeEventListener("touchend", handleEnd);
		};

		window.addEventListener("mousemove", handleMove);
		window.addEventListener("mouseup", handleEnd);
		window.addEventListener("touchmove", handleMove, { passive: false });
		window.addEventListener("touchend", handleEnd);
	};

	const selectedSpot = spots.find((spot) => spot.id === selectedSpotId);

	return (
		<div className="mx-auto my-5 w-fit font-sans">
			<div className="grid grid-cols-[30px_340px_40px] grid-rows-[30px_340px_40px] gap-2 items-center text-center">
				<div />
				<div className="text-sm font-bold text-gray-600">{xLabel}</div>
				<div />

				<div className="flex justify-center items-center h-full text-sm font-bold text-gray-600 [writing-mode:vertical-rl] select-none">
					{yLabel}
				</div>

				<div
					ref={matrixRef}
					className="relative border-2 border-gray-300 bg-gray-50 rounded-xl overflow-hidden shadow-inner"
					style={{ width: `${matrixSize}px`, height: `${matrixSize}px` }}
				>
					<div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-300" />
					<div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-300" />

					{selectedSpot && (
						<>
							<div
								style={{ bottom: `${selectedSpot.y}%` }}
								className="absolute left-0 right-0 border-t border-dashed border-gray-400 z-10 pointer-events-none"
							/>
							<div
								style={{ left: `${selectedSpot.x}%` }}
								className="absolute top-0 bottom-0 border-l border-dashed border-gray-400 z-10 pointer-events-none"
							/>
						</>
					)}

					{spots.map((spot) => (
						<div key={spot.id}>
							<button
								type="button"
								onMouseDown={(e) => {
									e.preventDefault();
									handleStart(spot, e.clientX, e.clientY);
								}}
								onTouchStart={(e) => {
									if (e.cancelable) e.preventDefault();
									handleStart(spot, e.touches[0].clientX, e.touches[0].clientY);
								}}
								style={{ left: `${spot.x}%`, bottom: `${spot.y}%` }}
								className={`absolute translate-x-[-50%] translate-y-[50%] w-5 h-5 rounded-full shadow-lg border-2 border-white z-20 cursor-move transition-transform active:scale-125 ${
									selectedSpot?.id === spot.id ? "bg-blue-500" : "bg-red-500"
								}`}
							/>
							<p
								className={`absolute translate-x-[-50%] translate-y-[50%]`}
								style={{ left: `${spot.x}%`, bottom: `${spot.y - 5}%` }}
							>
								{spot.name}
							</p>
						</div>
					))}
				</div>

				{selectedSpot ? (
					<div className="relative w-full h-[340px] flex items-center justify-center">
						<input
							type="range"
							min="0"
							max="100"
							value={selectedSpot.y}
							onChange={(e) =>
								onMoved({ id: selectedSpot.id, newY: Number(e.target.value) })
							}
							style={{ width: `${matrixSize}px` }}
							className="absolute -rotate-90 origin-center h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
						/>
					</div>
				) : (
					<div />
				)}

				<div />
				{selectedSpot ? (
					<div className="flex items-center justify-center">
						<input
							type="range"
							min="0"
							max="100"
							value={selectedSpot.x}
							onChange={(e) =>
								onMoved({ id: selectedSpot.id, newX: Number(e.target.value) })
							}
							className="w-[340px] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
						/>
					</div>
				) : (
					<div />
				)}
				<div />
			</div>
		</div>
	);
}
