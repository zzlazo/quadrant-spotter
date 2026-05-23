import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import type { Spot } from "@/infrastructure/models/quadrantModels";

const SpotListTile = ({ title, onClick, onActionClick, onChangedName }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(title);

	const handleEditStart = (e) => {
		e.stopPropagation(); // 親のイベント発火を防ぐ
		setIsEditing(true);
		setEditValue(title);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (editValue.trim() && editValue !== title) {
			onChangedName(editValue);
		}
		setIsEditing(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditValue(title);
	};

	return (
		<div className="flex items-center justify-between border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors">
			{isEditing ? (
				<form
					onSubmit={handleSubmit}
					className="flex-1 flex items-center p-4 gap-2"
				>
					<input
						type="text"
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						className="flex-1 px-2 py-1 text-sm border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium text-gray-800"
					/>
					<button
						type="submit"
						className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
						aria-label="確定"
					>
						<Check className="w-5 h-5" />
					</button>
					<button
						type="button"
						onClick={handleCancel}
						className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors text-xs"
					>
						キャンセル
					</button>
				</form>
			) : (
				<button
					type="button"
					onClick={onClick}
					className="flex-1 flex items-center p-4 text-left font-medium text-gray-800 cursor-pointer focus:outline-none focus:bg-gray-50"
				>
					{title}
				</button>
			)}

			<div className="p-4 flex items-center gap-1">
				{!isEditing && (
					<button
						type="button"
						onClick={handleEditStart}
						className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:scale-95 transition-all focus:outline-none"
						aria-label={`${title}の名前を編集`}
					>
						<Pencil className="w-4 h-4" />
					</button>
				)}

				<button
					type="button"
					onClick={onActionClick}
					className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-600 active:scale-95 transition-all focus:outline-none"
					aria-label={`${title}のアクション`}
				>
					<X className="w-5 h-5"></X>
				</button>
			</div>
		</div>
	);
};

interface SpotListViewProps {
	spots: Spot[];
	onClick: (id: number) => void;
	onActionClick: (id: number) => void;
	onAdd: () => void;
	onChangedName: (id: number, newName: string) => void;
}

export default function SpotListView({
	spots,
	onClick,
	onActionClick,
	onAdd,
	onChangedName,
}: SpotListViewProps) {
	return (
		<div>
			<div className="max-w-md mx-auto my-8 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
				<button
					onClick={onAdd}
					type="button"
					className="w-full py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
				>
					+ 新規作成
				</button>
			</div>
			<div className="max-w-md mx-auto my-8 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
				<div>
					{spots.map((spot) => (
						<SpotListTile
							key={spot.id}
							title={spot.name}
							onClick={() => onClick(spot.id)}
							onActionClick={() => onActionClick(spot.id)}
							onChangedName={(newName: string) =>
								onChangedName(spot.id, newName)
							}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
