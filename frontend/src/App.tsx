import Home from "./pages/Home"
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENTID;


function App() {


  return (
    <>
    <GoogleOAuthProvider clientId={clientId}>
    <Home/>
    </GoogleOAuthProvider>
    </>
  )
}

export default App
