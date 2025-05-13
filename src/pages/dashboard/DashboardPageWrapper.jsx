import "../../styles/Dashboard.css";

export default function DashboardPageWrapper({ children, maxWidth }) {
  const style = {
    "--max-width-dashboard-page": maxWidth,
  };
  
  return (
    <div className="dashboard-wrapper" style={style}>
      {children}
    </div>
  );
}
