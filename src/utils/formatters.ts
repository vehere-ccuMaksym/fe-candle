import type { CandleDataItem } from "../constants/types";

export const ItemAPItoChartData = (item: CandleDataItem) => [new Date(item.timestamp), item.low, item.open, item.close, item.high];

export const ArrAPItoChartData = (data: CandleDataItem[]) => data.map(ItemAPItoChartData);

export const AppendItemToChartData = (chartData: any[], item: CandleDataItem) => {
	chartData.splice(1, 1);
	return [...chartData, ItemAPItoChartData(item)];
};
