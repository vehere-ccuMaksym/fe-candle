import type { CoinsData } from "./types";

export const COIN_DETAILS: any = {
	"BTC-USDT": { name: "Bitcoin", symbol: "BTC" },
	"ETH-USDT": { name: "Ethereum", symbol: "ETH" },
	"XRP-USDT": { name: "Ripple", symbol: "XRP" },
};

export const CHART_OPTIONS = {
	animation: {
		duration: 300,
	},
	legend: "none",
	backgroundColor: "transparent",
	bar: { groupWidth: "100%" }, // No space between candles
	candlestick: {
		fallingColor: { strokeWidth: 0, fill: "#ef4444" },
		risingColor: { strokeWidth: 0, fill: "#22c55e" },
	},
	hAxis: {
		textStyle: { color: "#9ca3af" },
	},
	vAxis: {
		textStyle: { color: "#9ca3af" },
		gridlines: { color: "#374151" },
	},
	chartArea: { width: "90%", height: "80%" },
};

export const COINS = ["BTC-USDT", "ETH-USDT", "XRP-USDT"];

export const EMPTY_STORE_DATA: CoinsData = {
	"BTC-USDT": [],
	"ETH-USDT": [],
	"XRP-USDT": [],
};
