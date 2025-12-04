import type { FC } from "react";
import { Chart } from "react-google-charts";

// Constants
import type { CandleDataItem } from "../../constants/types";
import { CHART_OPTIONS } from "../../constants/constants";

type Props = {
	candleData: CandleDataItem[][];
	loading: boolean;
};

const CandleChart: FC<Props> = ({ candleData, loading }) => {
	return (
		<div className="bg-slate-800 rounded-2xl p-4 mb-6 sm:p-6 shadow-xl border border-slate-700/50 relative">
			<div className="h-[400px] sm:h-[500px] w-full relative">
				<Chart chartType="CandlestickChart" width="100%" height="100%" data={candleData} options={CHART_OPTIONS} />
			</div>
			{loading && (
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
			)}
		</div>
	);
};

export default CandleChart;
