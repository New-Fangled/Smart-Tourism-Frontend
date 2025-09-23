import { useEffect, useState } from "react";
import { getUserDashboard } from "../api/dashboardApi";

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserDashboard();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>Total Permits: {stats.totalPermits}</p>
      <p>Active Visitors: {stats.activeVisitors}</p>
      <p>Pending Requests: {stats.pendingRequests}</p>
      <p>Total EcoTax: {stats.ecoTaxTotal}</p>
    </div>
  );
};

export default Dashboard;
