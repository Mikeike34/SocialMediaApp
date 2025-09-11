import {Box} from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserFeed from "./pages/UserFeed";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Box minH = {'100vh'}>
      <Routes>
        <Route path = '/' element = {<LoginPage />} />
        <Route path = '/signup' element = {<SignupPage />} />
        
        {/*Protected Routes*/}
        <Route element={<ProtectedRoute />}>
          <Route path ='/feed' element = {<UserFeed />} />
          <Route path = '/profile' element = {<UserProfile />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App