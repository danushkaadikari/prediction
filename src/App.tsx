import "./App.css";
import { BrowserRouter } from "react-router-dom";

import Routers from "./components/Router";
import MetmaskContextProvider from "./contexts/MetmaskContextProvider";

function App() {
  return (
    <MetmaskContextProvider>
      <div className="absolute w-screen" id="dashboard">
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </div>
    </MetmaskContextProvider>
  );
}

export default App;
