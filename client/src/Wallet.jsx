import server from "./server";

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Public Key</h1>

      <label>
        Public Key
        <input placeholder="Type your public key" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
