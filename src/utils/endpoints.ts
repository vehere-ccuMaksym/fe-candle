const basicFetch = async (path: string, props: any) => {
	const controller = new AbortController();
	return fetch(path, { ...props, signal: controller.signal })
		.then((response) => {
			const { status } = response;
			if (status === 404 || status === 500 || status === 504) return { result: false, message: "API connection error!", status };
			return response.json();
		})
		.catch(() => ({ result: false, message: "Looks like you are offline" }))
		.finally(() => controller.abort());
};

export const getCandles = (coin: string) => basicFetch(`http://localhost:3001/api/candles/${coin}`, { method: "GET" });

export const getOrderBook = (coin: string) => basicFetch(`http://localhost:3001/api/orderbook/${coin}`, { method: "GET" });
