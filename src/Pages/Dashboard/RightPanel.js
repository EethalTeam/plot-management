import ReactApexChart from 'react-apexcharts';
import '../../Assets/app.css';

const RightPanel = () => {
  // Sample data: today's trending issued plots
  const options = {
    chart: {
      type: 'donut',
    },
    labels: ['Available', 'Booked', 'Hold', 'Sold'],
    colors: ['#00E396', '#FEB019', '#FF4560', '#775DD0'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
  };

  const series = [5, 2, 3, 4]; // issued today

  return (
    <div className="right-panel">
      {/* Trending Chart */}
      <div className="chart-section">
        <h3 className="section-title">Today's Trending</h3>
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={180}
        />
      </div>

      {/* Recent Sales */}
      <div className="sales-section">
        <h4 className="section-title">Recent Plot Activities</h4>
        <ul className="sales-list">
          <li>Plot 105 is Booked</li>
          <li>Plot 867 is Reserved</li>
          <li>Plot 1698 is Hold</li>
          <li>Plot 17 is Sold</li>
        </ul>
      </div>
    </div>
  );
};

export default RightPanel;
