// ★ Trash2 アイコンを追加
import { FilePlus, Menu, Pen, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import QuadrantMatrix from "@/components/QuadrantMatrix";
import SpotListView from "@/components/SpotListView";
import { useQuadrantStore } from "@/stores/useQuadrans";

function App() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	// ダイアログの開閉状態と編集用の一時フォーム状態
	const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
	const [editXLabel, setEditXLabel] = useState("");
	const [editYLabel, setEditYLabel] = useState("");

	// 状態の取得
	const quadrants = useQuadrantStore((state) => state.quadrants);
	const selectedQuadrant = useQuadrantStore((state) => state.selectedQuadrant);
	const selectedSpot = useQuadrantStore(
		(state) =>
			state.currentSpots.find((s) => s.id === state.selectedSpotId) || null,
	);
	const currentSpots = useQuadrantStore((state) => state.currentSpots);
	const isLoading = useQuadrantStore((state) => state.isLoading);
	const isLightLoading = useQuadrantStore((state) => state.isLightLoading);
	const error = useQuadrantStore((state) => state.error);

	const fetchQuadrants = useQuadrantStore((state) => state.fetch);
	const selectQuadrant = useQuadrantStore((state) => state.selectQuadrant);
	const selectSpot = useQuadrantStore((state) => state.selectSpot);
	const moveSpot = useQuadrantStore((state) => state.moveSpot);
	const createQuadrant = useQuadrantStore((state) => state.create);
	const updateQuadrantXLabel = useQuadrantStore(
		(state) => state.updateQuadrantXLabel,
	);
	const updateQuadrantYLabel = useQuadrantStore(
		(state) => state.updateQuadrantYLabel,
	);
	const deleteQuadrant = useQuadrantStore((state) => state.delete);
	const deleteSpot = useQuadrantStore((state) => state.deleteSpot);
	const createSpot = useQuadrantStore((state) => state.createSpot);
	const updateSpotName = useQuadrantStore((state) => state.updateSpotName);

	useEffect(() => {
		fetchQuadrants();
	}, [fetchQuadrants]);

	const onTapAddQuadrant = async () => {
		await createQuadrant("No Title", "No X Label", "No Y Label");
	};

	const handleDeleteQuadrant = async (
		id: number | null,
		e: React.MouseEvent,
	) => {
		if (!id) return;
		e.stopPropagation();

		if (
			window.confirm(
				"このマトリクスを削除してもよろしいですか？内包されるスポットもすべて削除されます。",
			)
		) {
			await deleteQuadrant(id);
		}
	};

	// ダイアログを開く処理（現在の設定値をインプットの初期値に代入）
	const handleOpenLabelDialog = () => {
		if (!selectedQuadrant) return;
		setEditXLabel(selectedQuadrant.xLabel);
		setEditYLabel(selectedQuadrant.yLabel);
		setIsLabelDialogOpen(true);
	};

	// ダイアログで「保存する」を押したときの処理
	const handleSaveLabels = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedQuadrant) return;

		updateQuadrantXLabel(selectedQuadrant.id, editXLabel.trim());
		updateQuadrantYLabel(selectedQuadrant.id, editYLabel.trim());
		setIsLabelDialogOpen(false); // ダイアログを閉じる
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col font-sans">
			{/* 1. AppBar (上部ナビゲーションバー) */}
			<header className="bg-blue-600 text-white h-16 px-4 flex items-center shadow-md sticky top-0 z-40">
				<button
					type="button"
					onClick={() => setIsDrawerOpen(true)}
					className="p-2 hover:bg-blue-700 rounded-full transition-colors mr-2 focus:outline-none"
					aria-label="メニューを開く"
				>
					<Menu></Menu>
				</button>
				<h1 className="text-xl font-medium tracking-wide select-none">
					四象限マトリクス分析
				</h1>
			</header>

			{/* 2. Hamburger Drawer (左側から飛び出るメニュー) */}
			<button
				type="button"
				aria-label="ドロワーを閉じる"
				className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
					isDrawerOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={() => setIsDrawerOpen(false)}
			/>

			<aside
				className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
					isDrawerOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="bg-blue-700 text-white p-6 flex flex-col justify-end h-40 shadow-inner">
					<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/20 mb-3">
						Q
					</div>
					<p className="font-semibold text-base leading-none">
						マトリクス分析アプリ
					</p>
				</div>

				<nav className="flex-1 overflow-y-auto py-2">
					<p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
						マトリクス一覧
					</p>
					<div className="space-y-1 px-2">
						{quadrants.map((q) => {
							const isSelected = q.id === selectedQuadrant?.id;
							return (
								// ★ 削除ボタンを内包するため、外側の要素をdiv（groupクラス付き）に変更
								<div
									key={q.id}
									className={`group flex items-center justify-between px-2 py-1 rounded-xl transition-colors ${
										isSelected ? "bg-blue-50" : "hover:bg-gray-50"
									}`}
								>
									{/* マトリクス切り替えボタン本体 */}
									<button
										type="button"
										onClick={() => {
											selectQuadrant(q.id);
											setIsDrawerOpen(false);
										}}
										className={`flex-1 flex items-center px-2 py-2 text-sm font-medium transition-colors text-left ${
											isSelected ? "text-blue-600" : "text-gray-700"
										}`}
									>
										<span
											className={`w-2.5 h-2.5 rounded-full mr-4 shrink-0 ${isSelected ? "bg-blue-600" : "bg-gray-300"}`}
										/>
										<span className="truncate">{q.name}</span>
									</button>

									{/* ★ 削除ボタン (ホバー時に表示される、選択中なら常時薄く表示) */}
									<button
										type="button"
										onClick={(e) => handleDeleteQuadrant(q?.id, e)}
										className={`p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ${
											isSelected ? "opacity-40" : ""
										}`}
										aria-label={`${q.name}を削除`}
									>
										<Trash2 size={16} />
									</button>
								</div>
							);
						})}
					</div>
					<div className="px-4 py-3">
						<button
							onClick={onTapAddQuadrant}
							type="button"
							className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
						>
							+ 新規作成
						</button>
					</div>
				</nav>
			</aside>

			{/* 3. Body (コンテンツ表示エリア) */}
			<main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
				{error && (
					<div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium border border-red-200">
						⚠️ エラーが発生しました: {error}
					</div>
				)}

				{/* データが存在しない・またはマトリクスが未選択時の空状態表示 */}
				{!selectedQuadrant && quadrants.length === 0 && (
					<div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-200 text-center max-w-md mx-auto my-12">
						<div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 border border-blue-100">
							<FilePlus></FilePlus>
						</div>
						<h3 className="text-lg font-bold text-gray-800 mb-2">
							マトリクスがありません
						</h3>
						<p className="text-sm text-gray-500 mb-6 leading-relaxed">
							分析を始めるには、最初の四象限マトリクスを新規作成してください。
						</p>
						<button
							type="button"
							onClick={onTapAddQuadrant}
							className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium text-sm rounded-xl shadow-sm hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
						>
							新しいマトリクスを作成
						</button>
					</div>
				)}

				{/* データはあるが、何も選択されていない状態の表示 */}
				{!selectedQuadrant && quadrants.length > 0 && (
					<div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-200 text-center max-w-md mx-auto my-12 animate-fade-in">
						<div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 border border-gray-100">
							<Menu></Menu>
						</div>
						<h3 className="text-lg font-bold text-gray-800 mb-2">
							マトリクスが未選択です
						</h3>
						<p className="text-sm text-gray-500 mb-6 leading-relaxed">
							左上のメニューボタンを開き、表示したいマトリクスを選択してください。
						</p>
						<button
							type="button"
							onClick={() => setIsDrawerOpen(true)}
							className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-800 text-white font-medium text-sm rounded-xl shadow-sm hover:bg-gray-700 active:bg-gray-900 focus:outline-none transition-all cursor-pointer"
						>
							メニューを開く
						</button>
					</div>
				)}

				{selectedQuadrant && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
						{/* 左側：スポット選択 */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
							<div className="flex justify-between items-center mb-4">
								<h2 className="font-bold text-gray-800">スポットを選択</h2>
								{isLightLoading && (
									<span className="text-xs text-blue-600 animate-pulse">
										同期中...
									</span>
								)}
							</div>

							{isLoading ? (
								<div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
							) : (
								<SpotListView
									spots={currentSpots}
									onClick={selectSpot}
									onActionClick={(id) => deleteSpot(id)}
									onAdd={() =>
										createSpot(`Spot ${currentSpots.length + 1}`, 50, 50)
									}
									onChangedName={updateSpotName}
								/>
							)}
						</div>

						{/* 右側：マトリクス */}
						<div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 min-h-[440px] flex flex-col">
							{/* 一括ヘッダーエリア（タイトル表示 ＆ 一括編集ボタン） */}
							<div className="mb-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div>
									{/* マトリクスのタイトルを最上部に配置 */}
									<h2 className="text-xl font-bold text-gray-800 tracking-tight mb-1">
										{selectedQuadrant.name}
									</h2>
									{/* サブ要素として軸の現在の情報を明示 */}
									<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 font-medium">
										<div>
											<span className="font-bold px-1.5 py-0.5 bg-gray-100 rounded mr-1 text-gray-600">
												X軸
											</span>
											{selectedQuadrant.xLabel}
										</div>
										<div className="text-gray-300 hidden sm:block">|</div>
										<div>
											<span className="font-bold px-1.5 py-0.5 bg-gray-100 rounded mr-1 text-gray-600">
												Y軸
											</span>
											{selectedQuadrant.yLabel}
										</div>
									</div>
								</div>

								{/* 統合された情報編集ボタン */}
								<button
									type="button"
									onClick={handleOpenLabelDialog}
									className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 text-gray-700 hover:text-blue-600 hover:bg-blue-50 text-xs font-semibold rounded-xl transition-all border border-gray-200 shadow-sm cursor-pointer"
								>
									<Pencil></Pencil>
									マトリクスを編集
								</button>
							</div>

							{/* マトリクス図本体の描画領域 */}
							<div className="flex-1 flex items-center justify-center">
								{isLoading && currentSpots.length === 0 ? (
									<p className="text-gray-400">ロード中...</p>
								) : (
									<QuadrantMatrix
										xLabel={selectedQuadrant?.xLabel}
										yLabel={selectedQuadrant?.yLabel}
										onMoved={({ id, newX, newY }) =>
											moveSpot({ id: id, newX: newX, newY: newY })
										}
										selectedSpotId={selectedSpot?.id}
										spots={currentSpots}
										onTapSpot={selectSpot}
									/>
								)}
							</div>
						</div>
					</div>
				)}
			</main>

			{isLabelDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<button
						type="button"
						onClick={() => setIsLabelDialogOpen(false)}
						className="absolute inset-0 bg-black/50 transition-opacity"
						aria-label="ダイアログを閉じる"
					/>

					<div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full relative z-10 border border-gray-100 animate-fade-in animate-duration-200">
						<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
							<Pencil></Pencil>
							軸ラベルの編集
						</h3>

						<form onSubmit={handleSaveLabels} className="space-y-4">
							<div>
								<label
									htmlFor="matrix-dialog-xlabel"
									className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 cursor-pointer"
								>
									X軸のラベル（横軸）
								</label>
								<input
									id="matrix-dialog-xlabel"
									type="text"
									required
									value={editXLabel}
									onChange={(e) => setEditXLabel(e.target.value)}
									className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
									placeholder="例: 重要度、コストなど"
								/>
							</div>

							<div>
								<label
									htmlFor="matrix-dialog-ylabel"
									className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 cursor-pointer"
								>
									Y軸のラベル（縦軸）
								</label>
								<input
									id="matrix-dialog-ylabel"
									type="text"
									required
									value={editYLabel}
									onChange={(e) => setEditYLabel(e.target.value)}
									className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
									placeholder="例: 緊急度、成果など"
								/>
							</div>

							<div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-5">
								<button
									type="button"
									onClick={() => setIsLabelDialogOpen(false)}
									className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
								>
									キャンセル
								</button>
								<button
									type="submit"
									className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-sm cursor-pointer"
								>
									保存する
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
