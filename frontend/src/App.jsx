import {Box} from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserFeed from "./pages/UserFeed";
import UserProfile from "./pages/UserProfile";


function App() {
  return (
    <Box minH = {'100vh'}>
      <Routes>
        <Route path = '/' element = {<LoginPage />} />
        <Route path = '/signup' element = {<SignupPage />} />
        <Route path ='/feed' element = {<UserFeed />} />
        <Route path = '/profile' element = {<UserProfile />} />
      </Routes>
    </Box>
  );
}

export default App