import { Routes, Route } from "react-router"
import Login from "../pages/loginPage"

const Router = () => {
    return(
        <Routes>
            <Route path="/" element={<Login />} />
        </Routes>
    )
}

export default Router;