import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Password from "./Password";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Password address={address} />
      <Transfer setBalance={setBalance} address={address} />
    </div>
  );
}

export default App;
