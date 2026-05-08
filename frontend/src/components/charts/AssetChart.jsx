import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

/**
 * AssetChart — renders either a Doughnut or Bar chart.
 *
 * @param {"doughnut"|"bar"} type   — chart type
 * @param {string}           title  — chart heading
 * @param {string[]}         labels — category labels
 * @param {number[]}         values — data values
 * @param {string[]}         colors — background colors per segment
 */
export default function AssetChart({
  type = 'doughnut',
  title,
  labels = [],
  values = [],
  colors = [],
}) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.length
          ? colors
          : ['#4c6ef5', '#40c057', '#fab005', '#fa5252', '#339af0', '#845ef7'],
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: type === 'bar' ? 6 : 0,
        hoverOffset: type === 'doughnut' ? 8 : 0,
      },
    ],
  }

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === 'doughnut' ? 'bottom' : 'top',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { family: "'Inter', sans-serif", size: 12, weight: 500 },
          color: '#868e96',
        },
      },
      tooltip: {
        backgroundColor: '#1a1d2e',
        titleFont: { family: "'Inter', sans-serif", size: 13, weight: 600 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
      },
    },
  }

  const barOptions = {
    ...commonOptions,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 12 },
          color: '#868e96',
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 12 },
          color: '#868e96',
          precision: 0,
        },
      },
    },
  }

  const doughnutOptions = {
    ...commonOptions,
    cutout: '68%',
  }

  return (
    <div className="card">
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      <div style={{ position: 'relative', height: 280 }}>
        {type === 'bar' ? (
          <Bar data={data} options={barOptions} />
        ) : (
          <Doughnut data={data} options={doughnutOptions} />
        )}
      </div>
    </div>
  )
}
