import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import type { ChartOptions } from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface Dataset {
  label: string;
  data: { x: string; y: number }[] | number[];
  borderColor: string;
  backgroundColor: string;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
}

interface LineChartProps {
  data: {
    labels?: string[];
    datasets: Dataset[];
  };
  options?: ChartOptions<"line">;
}

const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  return <Line data={data} options={options} />;
};

export default LineChart;
