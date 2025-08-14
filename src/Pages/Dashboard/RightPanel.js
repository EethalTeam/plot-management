import ReactApexChart from 'react-apexcharts';
import '../../Assets/app.css';

const RightPanel = ({DashBoard, FollowUps, CompletedFollowUps}) => {
  // Sample data: today's trending issued plots
  // const options = {
  //   chart: {
  //     type: 'donut',
  //   },
  //   labels: ['Available', 'Booked', 'Hold', 'Sold','Reserved'],
  //   colors: [DashBoard.available.colorCode || '#FFF',DashBoard.booked.colorCode || '#FFF', DashBoard.hold.colorCode || '#FFF',DashBoard.sold.colorCode || '#FFF',DashBoard.reserved.colorCode || '#FFF'],
  //   legend: { position: 'bottom' },
  //   dataLabels: { enabled: true },
  // };

  // const series = [DashBoard.available.count || 0,DashBoard.booked.count || 0,DashBoard.hold.count || 0,DashBoard.sold.count || 0,DashBoard.reserved.count || 0]; 

  return (
    <div className="right-panel">
      {/* Recent Sales */}
      <div className="sales-section">
        <h4 className="section-title">Today Pending Follow Ups</h4>
       {FollowUps.length > 0 ?
        <>
        <ul className="sales-list">
           {FollowUps.map((val)=>
          <li>{val.visitorName} - {val.notes}</li>
          )
        }
        </ul>
        </>:<span style={{color:'#c4bbbb'}}>No Pending Follow Ups Today</span>
}
      </div>
       <div className="sales-section">
        <h4 className="section-title">Completed Follow Ups</h4>
       {CompletedFollowUps.length > 0 ?
        <>
        <ul className="sales-list">
           {CompletedFollowUps.map((val)=>
          <li>{val.visitorName} - {val.followUpDescription}</li>
          )
        }
        </ul>
        </>:<span style={{color:'#c4bbbb'}}>-- No records Today --</span>
}
      </div>
            {/* Trending Chart */}
      {/* <div className="chart-section">
        <h3 className="section-title">Today's Trending</h3>
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={180}
        />
      </div> */}
    </div>
  );
};

export default RightPanel;
