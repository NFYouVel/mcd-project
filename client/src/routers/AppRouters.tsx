import { Routes, Route } from "react-router"
import Login from "../pages/LoginPage"
import NavBar from "../pages/NavBar";

const Dashboard = () => <h1>Dashboard</h1>;
const Products = () => <h1>Products</h1>;
const Orders = () => <h1>Orders</h1>;



const Router = () => {
    return(
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/menu" element={<NavBar />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
            </Route>
        </Routes>
    )
}

export default Router;