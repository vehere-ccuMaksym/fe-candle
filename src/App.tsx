import { Activity, useContext, useEffect, useState } from "react";
import type { CandleDataItem, CoinsDataStoreProps, OrderBookData, OrderBookItem, WebSocketMessage } from "./constants/types";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { MobXProviderContext, observer } from "mobx-react";

// Components
import CandleChart from "./components/CandleChart/CandleChart";
import OrderBook from "./components/OrderBook/OrderBook";

// Constants
import { COIN_DETAILS } from "./constants/constants";

// Utils
import { AppendItemToChartData, ArrAPItoChartData } from "./utils/formatters";
import { getCandles, getOrderBook } from "./utils/endpoints";

const useMobxStore = (storeName: string) => useContext(MobXProviderContext)[storeName];

const App = () => {
	const { coinsData, clearStore, setCoinsData }: CoinsDataStoreProps = useMobxStore("CoinsDataStore");
	const [selectedCoin, setSelectedCoin] = useState("BTC-USDT");
	const [selectedData, setSelectedData] = useState("all");
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [candleData, setCandleData] = useState<CandleDataItem[][]>([]);
	const [asks, setAsks] = useState<OrderBookItem[]>([]);
	const [bids, setBids] = useState<OrderBookItem[]>([]);

	const [candleIsLoading, setCandleIsLoading] = useState(true);
	const [orderBookIsLoading, setOrderBookIsLoading] = useState(true);

	const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket<WebSocketMessage>("ws://localhost:3001", {
		shouldReconnect: () => true,
		reconnectAttempts: 10,
		reconnectInterval: 3000,
	});

	const connectionStatus = {
		[ReadyState.CONNECTING]: { label: "Connecting", color: "yellow" },
		[ReadyState.OPEN]: { label: "Open", color: "green" },
		[ReadyState.CLOSING]: { label: "Closing", color: "orange" },
		[ReadyState.CLOSED]: { label: "Closed", color: "red" },
		[ReadyState.UNINSTANTIATED]: { label: "Uninstantiated", color: "black" },
	}[readyState];

	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			clearStore();
		};
	}, []);

	useEffect(() => {
		setCandleIsLoading(true);
		setOrderBookIsLoading(true);

		if (coinsData[selectedCoin].length === 0) {
			// Fetch only if not in store
			getCandles(selectedCoin)
				.then((data: CandleDataItem[]) => {
					const chartData: any[] = [["Date", "Low", "Open", "Close", "High"], ...ArrAPItoChartData(data)];
					setCandleData(chartData);
					setCoinsData({ ...coinsData, [selectedCoin]: chartData });
				})
				.finally(() => {
					setCandleIsLoading(false);
				});
		} else {
			// If in store, use it
			setCandleData(coinsData[selectedCoin]);
			setCandleIsLoading(false);
		}

		getOrderBook(selectedCoin)
			.then((data) => {
				setAsks(data?.asks || []);
				setBids(data?.bids || []);
			})
			.finally(() => {
				setOrderBookIsLoading(false);
			});
		sendJsonMessage({ type: "subscribe", pair: selectedCoin, stream: selectedData });
	}, [selectedCoin, selectedData]);

	useEffect(() => {
		if (["candle_update", "initial_candles"].includes(lastJsonMessage?.type)) {
			const newChartData: any[] = AppendItemToChartData(candleData, lastJsonMessage.data as CandleDataItem);
			setCandleData(newChartData);
		}
		if (["orderbook_update", "orderbook_candles"].includes(lastJsonMessage?.type)) {
			const { asks: _asks, bids: _bids } = lastJsonMessage?.data as OrderBookData;
			setAsks(_asks);
			setBids(_bids);
		}
	}, [lastJsonMessage]);

	return (
		<div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
			<header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">
							C
						</div>
						<h1 className="text-xl font-bold tracking-tight">CoinView</h1>
					</div>
					<div className="absolute top-6 right-10 text-sm text-slate-400 hidden sm:block">
						Connection Status:{" "}
						<span style={{ color: `${isOnline ? connectionStatus.color : "red"}`, fontWeight: "bold" }}>
							● {isOnline ? connectionStatus.label : "Offline"}
						</span>
					</div>
				</div>
			</header>
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h2 className="text-2xl font-bold">{COIN_DETAILS[selectedCoin].name} Analysis</h2>
						<p className="text-slate-400 mt-1">
							Live performance for <span className="font-mono text-indigo-400">{COIN_DETAILS[selectedCoin].symbol}</span>
						</p>
					</div>
					<div className="flex flex-col sm:flex-row items-center gap-2 w-100%">
						<div className="relative w-full sm:w-auto">
							<select
								value={selectedData}
								onChange={(e) => setSelectedData(e.target.value)}
								className="w-full sm:w-48 appearance-none bg-slate-800 border border-slate-700 hover:border-indigo-500 text-white py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-medium shadow-lg"
							>
								<option value="all">All</option>
								<option value="candles">Candles</option>
								<option value="orderbook">Orderbook</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
								<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
									<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
								</svg>
							</div>
						</div>
						<div className="relative w-full sm:w-auto">
							<select
								value={selectedCoin}
								onChange={(e) => setSelectedCoin(e.target.value)}
								className="w-full sm:w-48 appearance-none bg-slate-800 border border-slate-700 hover:border-indigo-500 text-white py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-medium shadow-lg"
							>
								<option value="BTC-USDT">Bitcoin</option>
								<option value="ETH-USDT">Ethereum</option>
								<option value="XRP-USDT">XRP</option>
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
								<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
									<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
								</svg>
							</div>
						</div>
					</div>
				</div>
				<Activity mode={["all", "candles"].includes(selectedData) ? "visible" : "hidden"}>
					<CandleChart candleData={candleData} loading={candleIsLoading} />
				</Activity>
				<Activity mode={["all", "orderbook"].includes(selectedData) ? "visible" : "hidden"}>
					<OrderBook asks={asks} bids={bids} loading={orderBookIsLoading} />
				</Activity>
			</main>
		</div>
	);
};

export default observer(App);
