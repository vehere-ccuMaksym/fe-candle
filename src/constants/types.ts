export type CandleDataItem = {
	timestamp: number;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
};

export type OrderBookItem = {
	price: number;
	quantity: number;
};

export type OrderBookData = {
	asks: OrderBookItem[];
	bids: OrderBookItem[];
};

export type WebSocketMessage = {
	data: CandleDataItem | OrderBookData;
	type: string;
	pair: string;
};

export type CoinsData = {
	"BTC-USDT": CandleDataItem[][];
	"ETH-USDT": CandleDataItem[][];
	"XRP-USDT": CandleDataItem[][];
	[key: string]: CandleDataItem[][];
};

export type CoinsDataStoreProps = {
	coinsData: CoinsData;
	clearStore: () => void;
	setCoinsData: (data: CoinsData) => void;
};
