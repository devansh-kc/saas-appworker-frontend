"use client";
import React, { useEffect, useState } from "react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { BACKEND_URL } from "../../../utils/utils";

function AppBar() {
  const { publicKey, signMessage } = useWallet();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  async function signAndSend() {
    try {
      if (!publicKey) {
        return;
      }
      const message = new TextEncoder().encode(
        "Sign into mechanical turks as a Worker"
      );
      const signature = await signMessage?.(message);
      const response = await axios.post(`${BACKEND_URL}/v1/worker/sign-up`, {
        signature,
        publicKey: publicKey?.toString(),
      });
      setBalance(response.data.amount);
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      throw error;
    }
  }

  async function sendPayout() {
    try {
      setLoading(true);
      const result = await axios.post(
        `${BACKEND_URL}/v1/worker/payout`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(result);
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    signAndSend();
  }, [publicKey]);
  return (
    <div className="flex justify-between m-4 items-center align-middle ">
      <div className="text-2xl pl-4 flex justify-center pt-3">
        Turkify Worker
      </div>
      <div className="text-xl flex m-2 ">
        <button
          disabled={loading}
          className="p-2  bg-black text-white rounded-xl "
          onClick={sendPayout}
        >
          {" "}
          Pay me out {balance} SOL
        </button>

        <button>
          {publicKey ? <WalletDisconnectButton /> : <WalletMultiButton />}
        </button>
      </div>
    </div>
  );
}

export default AppBar;
