import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFederatedKeylessAccounts } from "../core/useFederatedKeylessAccounts.ts";
import { AUTH0_ISS, AUTH0_CLIENT_ID } from "../core/constants";
import TransferModal from "../components/TransferModal";

function HomePage() {
  const navigate = useNavigate();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const { activeAccount, disconnectKeylessAccount } = useFederatedKeylessAccounts();

  useEffect(() => {
    if (!activeAccount) navigate("/");
  }, [activeAccount, navigate]);

  const copyAddress = async () => {
    if (activeAccount) {
      try {
        await navigator.clipboard.writeText(activeAccount.accountAddress.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset state after 2 seconds
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  const handleLogout = () => {
    // Clear local state
    disconnectKeylessAccount();
    
    // Redirect to Auth0 logout URL
    const auth0Domain = AUTH0_ISS.replace('https://', '');
    const returnTo = encodeURIComponent(window.location.origin);
    
    const logoutUrl = `https://${auth0Domain}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${returnTo}`;
    
    window.location.href = logoutUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen px-4">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome to Aptos!</h1>
        <p className="text-lg mb-8">You are now logged in</p>

        <div className="grid gap-2">
          {activeAccount ? (
            <div className="flex items-center justify-between border rounded-lg px-4 py-2 shadow-sm bg-gray-50">
              <span className="font-mono text-sm break-all flex-1 mr-2">
                {activeAccount?.accountAddress.toString()}
              </span>
              <button
                onClick={copyAddress}
                className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                title={copied ? "Copied!" : "Copy address"}
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <p>Not logged in</p>
          )}
          
          <button
            className="flex justify-center bg-blue-50 items-center border border-blue-200 rounded-lg px-8 py-2 shadow-sm shadow-blue-300 hover:bg-blue-100 active:scale-95 transition-all"
            onClick={() => setShowTransferModal(true)}
          >
            Transfer APT
          </button>
          
          <button
            className="flex justify-center bg-red-50 items-center border border-red-200 rounded-lg px-8 py-2 shadow-sm shadow-red-300 hover:bg-red-100 active:scale-95 transition-all"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      
      {showTransferModal && (
        <TransferModal
          onClose={() => setShowTransferModal(false)}
          activeAccount={activeAccount}
        />
      )}
    </div>
  );
}

export default HomePage;
