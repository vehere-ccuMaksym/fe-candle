import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import OrderBook from "./OrderBook";

const sampleAsks = [
	{ price: 105.5, quantity: 0.25 },
	{ price: 106.0, quantity: 0.5 },
];
const sampleBids = [
	{ price: 104.0, quantity: 0.125 },
	{ price: 103.5, quantity: 0.75 },
];

describe("OrderBook (Vitest)", () => {
	it("renders header, calculates best price and shows spinner when loading", () => {
		render(<OrderBook asks={sampleAsks as any} bids={sampleBids as any} loading={true} />);

		// Header and market price are visible
		expect(screen.getByText("Order Book")).toBeInTheDocument();

		// Best price = average of top ask (105.5) and top bid (104.0) => (105.5+104.0)/2 = 104.75 -> "104.75"
		expect(screen.getByText(/Current Market Price:/)).toHaveTextContent("Current Market Price: 104.75");

		// Top ask price (formatted to 2 decimals) is present
		expect(screen.getByText("105.50")).toBeInTheDocument();

		// Top bid price (formatted to 2 decimals) is present
		expect(screen.getByText("104.00")).toBeInTheDocument();

		// Loading spinner present when loading=true (component uses `.animate-spin`)
		expect(document.querySelector(".animate-spin")).toBeInTheDocument();
	});

	it("does not show spinner when loading is false and renders all rows", () => {
		render(<OrderBook asks={sampleAsks as any} bids={sampleBids as any} loading={false} />);

		// Spinner absent
		expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();

		// All ask rows rendered (2 asks)
		const askPrices = sampleAsks.map((a) => a.price.toFixed(2));
		for (const price of askPrices) {
			expect(screen.getByText(price)).toBeInTheDocument();
		}

		// All bid rows rendered (2 bids)
		const bidPrices = sampleBids.map((b) => b.price.toFixed(2));
		for (const price of bidPrices) {
			expect(screen.getByText(price)).toBeInTheDocument();
		}
	});
});
