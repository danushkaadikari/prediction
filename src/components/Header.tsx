import { useContext } from "react";

import MenuBar from "../assets/images/menu-bar.svg";
import WhiteLogo from "../assets/images/header-logo-white.svg";
import Button from "../UI/Button";
import { MetmaskContext } from "../contexts/MetmaskContextProvider";

export function Header() {
  const handleBuySell = () => {
    console.log("clicked on buy & sell");
  };
  const { connectHandler, account } = useContext(MetmaskContext);

  return (
    <>
      <div className="flex items-center mx-20 mt-5 mb-10">
        <img src={MenuBar} alt="menu-bar" className="max-w-full" />
        <img src={WhiteLogo} alt="logo" className="max-w-full ml-4 w-60" />
        <div className="flex justify-end w-full space-x-4">
          <Button onClick={handleBuySell} label="Buy & Sell" />
          <Button
            onClick={connectHandler}
            label={!!account ? account : "Connect Wallet"}
            color="default"
            disabled={!!account}
            customStyle="w-40 text-ellipsis overflow-hidden whitespace-nowrap"
            title={account ? account : ""}
          />
        </div>
      </div>
    </>
  );
}

export default Header;
