
import App from "./App";
import Map from "./Components/Map"
import Login from "./Components/Login"
import Signup from "./Components/SignUp"
import Verification from "./Components/Verification"
import OrderMap from "./Components/ReceivedOrder"
import RidesHistory from "./Components/Rides"
import Notifications from "./Components/Notifications"
import Profile from "./Components/Profile"
import Earnings from "./Components/Earnings"


const routes = [
    {path:"/", element:<App/>,
        children:[
            {path:"/", element:<Login/>},
            {path:"/dashboard", element:<Map/>},
            {path:"/signup", element:<Signup/>},
            {path:"/verification", element:<Verification/>},
            {path:"/order", element:<OrderMap/>},
            {path:"/rides", element:<RidesHistory/>},
            {path:"/notifications", element:<Notifications/>},
            {path:"/profile", element:<Profile/>},
            {path:"/earnings", element:<Earnings/>},
            
        ]
    },
    
    ];

export {routes}
