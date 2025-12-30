import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

function SpeedGraph({ wpm }) {
  const data = {
    labels: ["Your Speed (WPM)", "Ideal Min", "Ideal Max"],
    datasets: [
      {
        label: "Speaking Speed",
        data: [wpm, 110, 160],
        backgroundColor: ["#4caf50", "#2196f3", "#2196f3"]
      }
    ]
  };

  return <Bar data={data} />;
}

export default SpeedGraph;
