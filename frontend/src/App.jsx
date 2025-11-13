import {Box, Toaster} from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserFeed from "./pages/UserFeed";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import UpdateProfile from "./pages/UpdateProfile";


function App() {
  return (
    <Box minH = {'100vh'}>
      <Routes>
        <Route path = '/' element = {<Home />} />
        <Route path = '/login' element = {<LoginPage />} />
        <Route path = '/signup' element = {<SignupPage />} />
        
        {/*Protected Routes*/}
        <Route element={<ProtectedRoute />}>
          <Route path ='/feed' element = {<UserFeed />} />
          <Route path = '/profile' element = {<UserProfile />} />
          <Route path = '/create' element = {<CreatePost />} />
          <Route path = '/update' element = {<UpdateProfile />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App