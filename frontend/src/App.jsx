import {BrowserRouter, Routes, Route} from "react-router-dom";
import SignUp from './pages/SignUp.jsx'
import SingIn from './pages/SignIn.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SendMoney from './pages/SendMoney.jsx'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SingIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
