import { useState } from "react";
import { FederatedKeylessAccount } from "@aptos-labs/ts-sdk";
import { devnetClient } from "../core/constants";

interface TransferModalProps {
  onClose: () => void;
  activeAccount?: FederatedKeylessAccount;
}

interface TransferResult {
  hash: string;
  explorerUrl: string;
}

function TransferModal({ onClose, activeAccount }: TransferModalProps) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async () => {
    if (!activeAccount) {
      setError("No active account");
      return;
    }

    if (!recipientAddress.trim()) {
      setError("Please enter recipient address");
      return;
    }

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert amount to octas (1 APT = 10^8 octas)
      const amountInOctas = Math.floor(Number(amount) * 100000000);

      // Create transfer transaction
      const transaction = await devnetClient.transferCoinTransaction({
        sender: activeAccount.accountAddress,
        recipient: recipientAddress,
        amount: amountInOctas,
        coinType: "0x1::aptos_coin::AptosCoin",
      });

      // Sign and submit transaction
      const authenticator = devnetClient.sign({
        signer: activeAccount,
        transaction,
      });

      const committedTransaction = await devnetClient.transaction.submit.simple({
        transaction: transaction,
        senderAuthenticator: authenticator,
      });

      // Wait for transaction confirmation
      await devnetClient.waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      // Generate browser link
      const explorerUrl = `https://explorer.aptoslabs.com/txn/${committedTransaction.hash}?network=devnet`;

      setTransferResult({
        hash: committedTransaction.hash,
        explorerUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRecipientAddress("");
    setAmount("");
    setTransferResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transfer APT</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {transferResult ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">Transfer successful!</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Transaction hash:</span>
                  <p className="font-mono text-sm break-all">{transferResult.hash}</p>
                </div>
                <div>
                  <a
                    href={transferResult.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View transaction in browser
                  </a>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (APT)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.1"
                step="0.00000001"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Transferring..." : "Confirm transfer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransferModal;