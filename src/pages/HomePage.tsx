import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import GoogleLogo from "../components/GoogleLogo";
import { collapseAddress } from "../core/utils";
import { AptosClient, HexString } from "aptos";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

function HomePage() {
  const navigate = useNavigate();
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();
  const [balance, setBalance] = useState<number | null>(null);
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (!activeAccount) {
      navigate("/");
    } else {
      fetchBalance();
    }
  }, [activeAccount, navigate]);

  const fetchBalance = async () => {
    if (activeAccount) {
      try {
        const resources: any[] = await client.getAccountResources(
          HexString.ensure(activeAccount.accountAddress.toString())
        );
        const accountResource = resources.find(
          (r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
        );

        if (accountResource) {
          const balanceValue = (accountResource.data as any).coin.value;
          setBalance(balanceValue ? parseInt(balanceValue) / 100000000 : 0); // Convert from Octas to APT
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const handleTransfer = async () => {
    if (activeAccount && recipient && amount) {
      try {
        // Convert APT to Octas
        const amountInOctas = parseFloat(amount) * 100000000;

        const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET })); // Configure your network here

        // Generate transaction
        const transaction = await aptos.transferCoinTransaction({
          sender: activeAccount.accountAddress,
          recipient: recipient,
          amount: amountInOctas,
        });

        // Sign and submit transaction
        const committedTxn = await aptos.signAndSubmitTransaction({
          signer: activeAccount,
          transaction,
        });
        const committedTransactionResponse = await aptos.waitForTransaction({
          transactionHash: committedTxn.hash,
        });
        console.log(
          "committedTransactionResponse:",
          committedTransactionResponse
        );

        if (committedTransactionResponse.vm_status == "Executed successfully") {
          alert("Transaction was successful!");
        }

        // Fetch balance after transfer
        fetchBalance();
      } catch (error) {
        console.error("Failed to transfer tokens:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen px-4">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome to Aptos!</h1>
        <p className="text-lg mb-8">You are now logged in</p>

        <div className="grid gap-2">
          {activeAccount ? (
            <div className="flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed">
              <GoogleLogo />
              {collapseAddress(activeAccount?.accountAddress.toString())}
            </div>
          ) : (
            <p>Not logged in</p>
          )}
          {activeAccount ? (
            <>
              <div className="flex justify-center items-center py-2">
                Wallet address: {activeAccount?.accountAddress.toString()}
              </div>
              <div className="flex justify-center items-center py-2">
                Balance: {balance !== null ? `${balance} APT` : "Loading..."}
              </div>
              <div className="flex flex-col items-center py-2">
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="mb-2 p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Amount of APT"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mb-2 p-2 border rounded"
                />
                <button
                  className="flex justify-center bg-blue-50 items-center border border-blue-200 rounded-lg px-8 py-2 shadow-sm shadow-blue-300 hover:bg-blue-100 active:scale-95 transition-all"
                  onClick={handleTransfer}
                >
                  Transfer
                </button>
              </div>
            </>
          ) : (
            <p>Not logged in</p>
          )}
          <button
            className="flex justify-center bg-red-50 items-center border border-red-200 rounded-lg px-8 py-2 shadow-sm shadow-red-300 hover:bg-red-100 active:scale-95 transition-all"
            onClick={disconnectKeylessAccount}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
