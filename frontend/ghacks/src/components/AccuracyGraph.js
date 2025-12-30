import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function AccuracyGraph({ accuracy }) {
  const data = {
    labels: ["Accurate Words", "Fillers"],
    datasets: [
      {
        data: [accuracy, 100 - accuracy],
        backgroundColor: ["#4caf50", "#f44336"]
      }
    ]
  };

  return <Doughnut data={data} />;
}

export default AccuracyGraph;
