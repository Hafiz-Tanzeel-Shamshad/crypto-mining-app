import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ethers } from 'ethers';

// NFT Contract details
const NFT_CONTRACT_ADDRESS = "0x6DD06462599551234908433235d6f50F77e82082";
const NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];
const BASE_MAINNET_CHAIN_ID = 8453; // Base Mainnet Chain ID

const ContractAddressCheck = ({ children }) => {
  const [isEligible, setIsEligible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkContractEligibility = async () => {
      try {
        // Check if ethereum object exists
        if (!window.ethereum) {
          throw new Error("Ethereum wallet not found. Please install MetaMask.");
        }

        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });

        // Create provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Check network
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(BASE_MAINNET_CHAIN_ID)) {
          try {
            // Attempt to switch network
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${BASE_MAINNET_CHAIN_ID.toString(16)}` }],
            });
            
            // Reload to reset provider
            window.location.reload();
            return;
          } catch (switchError) {
            // Handle network not added
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: `0x${BASE_MAINNET_CHAIN_ID.toString(16)}`,
                    chainName: 'Base Mainnet',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18
                    },
                    rpcUrls: ['https://mainnet.base.org'],
                    blockExplorerUrls: ['https://basescan.org/']
                  }]
                });
                window.location.reload();
                return;
              } catch (addError) {
                throw new Error(`Failed to add network: ${addError.message}`);
              }
            } else {
              throw new Error(`Network switch failed: ${switchError.message}`);
            }
          }
        }

        // Get user address
        const userAddress = await signer.getAddress();

        // Create contract instance
        const contract = new ethers.Contract(
          NFT_CONTRACT_ADDRESS, 
          NFT_ABI, 
          provider
        );

        // Check NFT balance
        const balance = await contract.balanceOf(userAddress);

        // Set eligibility
        setIsEligible(BigInt(balance) > BigInt(0));
      } catch (err) {
        console.error('Eligibility check error:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    checkContractEligibility();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Checking contract eligibility...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Not eligible
  if (!isEligible) {
    return <Navigate to="/not-eligible" replace />;
  }

  // Eligible, render children (dashboard)
  return children;
};

export default ContractAddressCheck;