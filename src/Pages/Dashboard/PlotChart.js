// components/PlotChart.js
import ReactApexChart from 'react-apexcharts';

const PlotChart = () => {
const options = {
  chart: {
    type: 'line',
    toolbar: { show: false },
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  dataLabels: { enabled: true },
  xaxis: {
    categories: ['Jun','Jul','Aug','Sep','Oct','Nov'],
  },
  title: {
    text: 'Monthly Plot Momentum',
    align: 'center',
    style: { fontSize: '20px', fontWeight: 'bold' },
  },
  colors: ['#008FFB','#00E396','#FF4560'],
};


  const series = [
    {
      name: 'Available',
      data: [120, 80, 60, 30, 70, 100],
    },
    {
      name: 'Booked',
      data: [110, 60, 20, 80, 90, 110],
    },
    {
      name: 'Sold',
      data: [150, 50, 70, 40, 100, 130],
    },
  ];

  return (
    <div>
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default PlotChart;
