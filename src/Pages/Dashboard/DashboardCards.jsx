// DashboardPlotBoxes.jsx
import '../../Assets/app.css';
import ReactApexChart from 'react-apexcharts';
import AnimatedNumber from './AnimatedNumber'
import Dashboard from './dashboard';

const DashboardPlotBoxes = ({DashBoard, setSelectedMenu, setFormID }) => {
    const options = {
    chart: {
      type: 'donut',
    },
    labels: ['Available', 'Booked', 'Hold', 'Sold','Reserved'],
    colors: [DashBoard.available.colorCode || '#FFF',DashBoard.booked.colorCode || '#FFF', DashBoard.hold.colorCode || '#FFF',DashBoard.sold.colorCode || '#FFF',DashBoard.reserved.colorCode || '#FFF'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
  };

  const series = [DashBoard.available.count || 0,DashBoard.booked.count || 0,DashBoard.hold.count || 0,DashBoard.sold.count || 0,DashBoard.reserved.count || 0]; 

  return (
    <div>
    <div className="dashboard-container" style={{margin:'0px'}}>
      <div className="plot-box parent" onClick={()=>{
        // setSelectedMenu("Master forms > Parent Product");setFormID(1007)
        }}>
        <h2>Total Visitors</h2>
        <p className="plot-count" >
          <AnimatedNumber target={DashBoard.totalVisitors || 0} />
          </p>
        {/* <span>Available Plots</span> */}
      </div>
      <div className="plot-box main-parent" onClick={()=>{
        // setSelectedMenu("Master forms > Main Parent");setFormID(1009)
        }}>
        <h2>Total Plots</h2>
        <p className="plot-count" >
          <AnimatedNumber target={DashBoard.totalPlots || 0} />
          </p>
        {/* <span>Available Units</span> */}
      </div>
       <div className="plot-box1 chart-section">
              <h3 className="section-title">Plot Status</h3>
              <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={180}
              />
       </div>
    </div>
     <div className="dashboard-container" style={{gap:'9px',marginTop:'110px',marginBottom:'0px'}}>
      <div className="plotDetails-box" style={{backgroundColor:Object.entries(DashBoard).length > 0 && DashBoard.available.colorCode || '#FFF'}} onClick={()=>{
        }}>
        <h5>Available</h5>
        <p className="plot-count" >
          <AnimatedNumber target={Object.entries(DashBoard).length > 0 && DashBoard.available.count || 0} />
          </p>
        {/* <span>Available Plots</span> */}
      </div>
      <div className="plotDetails-box" style={{backgroundColor:Object.entries(DashBoard).length > 0 && DashBoard.booked.colorCode || '#FFF'}} onClick={()=>{
        }}>
        <h5>Booked</h5>
        <p className="plot-count" >
          <AnimatedNumber target={Object.entries(DashBoard).length > 0 && DashBoard.booked.count || 0} />
          </p>
        {/* <span>Available Plots</span> */}
      </div>
      <div className="plotDetails-box" style={{backgroundColor:Object.entries(DashBoard).length > 0 && DashBoard.reserved.colorCode || '#FFF'}} onClick={()=>{
        }}>
        <h5>Reserved</h5>
        <p className="plot-count" >
          <AnimatedNumber target={Object.entries(DashBoard).length > 0 && DashBoard.reserved.count || 0} />
          </p>
        {/* <span>Available Plots</span> */}
      </div>
      <div className="plotDetails-box" style={{backgroundColor:Object.entries(DashBoard).length > 0 && DashBoard.hold.colorCode || '#FFF'}} onClick={()=>{
        }}>
        <h5>Hold</h5>
        <p className="plot-count" >
          <AnimatedNumber target={Object.entries(DashBoard).length > 0 && DashBoard.hold.count || 0} />
          </p>
        {/* <span>Available Plots</span> */}
      </div>
      <div className="plotDetails-box" style={{backgroundColor:Object.entries(DashBoard).length > 0 && DashBoard.sold.colorCode || '#FFF'}} onClick={()=>{
        }}>
        <h5>Sold</h5>
        <p className="plot-count" >
          <AnimatedNumber target={Object.entries(DashBoard).length > 0 && DashBoard.sold.count || 0} />
          </p>
        {/* <span>Available Plots</span> */}
      </div>
    </div>
    </div>
  );
};

export default DashboardPlotBoxes;
