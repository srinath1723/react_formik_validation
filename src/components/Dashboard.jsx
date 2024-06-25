import { Link, Outlet } from "react-router-dom";


const Dashboard = () => {
  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="nav-link active" aria-current="page">
          Dashboard
        </Link>
      </nav>
      <hr/>
      <Outlet />
      </div>
    
  );
};

export default Dashboard;
