// src/components/CandleChart/CandleChart.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import CandleChart from "./CandleChart";

// Mock the Chart from react-google-charts to a lightweight element
vi.mock("react-google-charts", () => {
	return {
		Chart: ({ chartType, width, height, data, options }: any) => (
			<div data-testid="mock-chart" data-chart-type={chartType} data-width={width} data-height={height} data-options={JSON.stringify(options)}>
				{JSON.stringify(data)}
			</div>
		),
	};
});

const sampleData = [
	["Date", "Low", "Open", "Close", "High"],
	[1660000000, 10, 12, 11, 13],
];

describe("CandleChart (Vitest)", () => {
	it("renders the chart with provided data and shows spinner when loading", () => {
		const { rerender } = render(<CandleChart candleData={sampleData as any} loading={true} />);

		// Chart is rendered via mock
		const chart = screen.getByTestId("mock-chart");
		expect(chart).toBeInTheDocument();
		expect(chart).toHaveTextContent("1660000000");

		// Loading spinner exists when loading=true (component uses `animate-spin` class)
		expect(document.querySelector(".animate-spin")).toBeInTheDocument();

		// When loading=false spinner should not be present
		rerender(<CandleChart candleData={sampleData as any} loading={false} />);
		expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();
	});
});
