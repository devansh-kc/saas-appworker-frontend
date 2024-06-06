import React from "react";

function AppBar() {
  return (
    <div className="flex justify-between border-b pb-2 pt-2">
      <div className="text-2xl pl-4 flex justify-center pt-3">
        Turkify Worker
      </div>
      <div className="text-xl pr-4 pb-2">
        <button>connect Wallet</button>
        {/* {publicKey  ? <WalletDisconnectButton /> : <WalletMultiButton />} */}
      </div>
    </div>
  );
}

export default AppBar;
