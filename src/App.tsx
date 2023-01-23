import "./App.css";
import { BrowserRouter } from "react-router-dom";

import Routers from "./components/Router";
import MetmaskContextProvider from "./contexts/MetmaskContextProvider";

function App() {
  return (
    <MetmaskContextProvider>
      <div className="absolute w-screen min-h-screen bg-gradient-to-b from-[#414593] to-[#00022E]">
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </div>
    </MetmaskContextProvider>
  );
}

export default App;
