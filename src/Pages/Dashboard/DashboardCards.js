// DashboardPlotBoxes.jsx
import '../../Assets/app.css';
import AnimatedNumber from './AnimatedNumber'

const DashboardPlotBoxes = ({ childPlot, parentPlot, mainParentPlot, setSelectedMenu, setFormID }) => {
  return (
    <div className="dashboard-container">
      {/* <div className="plot-box child">
        <h2>Child Product</h2>
        <p className="plot-count" 
        // onClick={()=>{setSelectedMenu("Master forms > Child Product");setFormID(1006)}}
        >
           <AnimatedNumber target={childPlot} />
          </p>
        <span>Available Units</span>
      </div> */}
      <div className="plot-box parent" onClick={()=>{setSelectedMenu("Master forms > Parent Product");setFormID(1007)}}>
        <h2>Total Vistors</h2>
        <p className="plot-count" >
          <AnimatedNumber target={parentPlot} />
          </p>
        {/* <span>Available Plots</span> */}
      </div>
      <div className="plot-box main-parent" onClick={()=>{setSelectedMenu("Master forms > Main Parent");setFormID(1009)}}>
        <h2>Available Plots</h2>
        <p className="plot-count" >
          <AnimatedNumber target={mainParentPlot} />
          </p>
        {/* <span>Available Units</span> */}
      </div>
    </div>
  );
};

export default DashboardPlotBoxes;
