import type { FC } from "react";

// Constants
import type { OrderBookItem } from "../../constants/types";

type Props = {
	asks: OrderBookItem[];
	bids: OrderBookItem[];
	loading: boolean;
};

const OrderBook: FC<Props> = ({ asks, bids, loading }) => {
	const bestPrice = (((asks[0]?.price || 0) + (bids[0]?.price || 0)) / 2).toFixed(2);
	return (
		<div className="lg:col-span-1 bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-auto lg:h-auto overflow-hidden relative">
			{loading && (
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
			)}
			<div className="flex justify-between pr-2">
				<div className="p-3 border-b border-slate-800 font-semibold text-sm text-slate-300">Order Book</div>
				<div className="p-3 border-b border-slate-800 font-semibold text-sm text-slate-300">Current Market Price: {bestPrice}</div>
			</div>
			{/* Table Headers */}
			<div className="grid grid-cols-3 px-3 py-2 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
				<div className="text-left">Price</div>
				<div className="text-right">Amount</div>
				<div className="text-right">Total</div>
			</div>

			<div className="py-2 border-y border-slate-800 bg-slate-700 text-center font-mono text-lg font-bold text-white flex items-center justify-center gap-2">
				<span className="text-rose-500 text-xs">Asks ↓</span>
			</div>
			{/* Asks (Sells) - Red */}
			<div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-end pb-1">
				{asks?.map((order: OrderBookItem, i) => (
					<div key={`ask-${i}`} className="grid grid-cols-3 px-3 py-0.5 hover:bg-slate-800/50 cursor-pointer text-xs font-mono relative group">
						<span className="text-rose-400 relative z-10">{order.price.toFixed(2)}</span>
						<span className="text-slate-300 text-right relative z-10">{order.quantity.toFixed(3)}</span>
						<span className="text-slate-500 text-right relative z-10">{(order.price * order.quantity).toFixed(0)}</span>
					</div>
				))}
			</div>

			{/* Spread */}
			<div className="py-2 border-y border-slate-800 bg-slate-700 text-center font-mono text-lg font-bold text-white flex items-center justify-center gap-2">
				<span className="text-emerald-500 text-xs">Bids ↑</span>
			</div>

			{/* Bids (Buys) - Green */}
			<div className="flex-1 overflow-y-auto custom-scrollbar pt-1">
				{bids?.map((order: OrderBookItem, i) => (
					<div key={`bid-${i}`} className="grid grid-cols-3 px-3 py-0.5 hover:bg-slate-800/50 cursor-pointer text-xs font-mono relative">
						<span className="text-emerald-400 relative z-10">{order.price.toFixed(2)}</span>
						<span className="text-slate-300 text-right relative z-10">{order.quantity.toFixed(3)}</span>
						<span className="text-slate-500 text-right relative z-10">{(order.price * order.quantity).toFixed(0)}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default OrderBook;
