import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";
import "./MetaMaskAuth.css"; 

const MetaMaskAuth = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referrer, setReferrer] = useState(null);
  const [isValidatingReferral, setIsValidatingReferral] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferralCode(refCode);
      validateReferralCode(refCode);
    }
  }, [searchParams]);

  // Video autoplay and loop
  const videoRef = useRef(null);
  useEffect(() => {
    // Ensure video plays and loops properly
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay prevented:", error);
        // Fallback: mute the video and try playing again
        videoRef.current.muted = true;
        videoRef.current.play();
      });
    }
  }, []);
  const validateReferralCode = async (code) => {
    setIsValidatingReferral(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/referral/validate/${code}`
      );
      if (response.data.valid) {
        setReferrer(response.data.referrer);
      } else {
        setError("Invalid referral code");
        setReferralCode("");
      }
    } catch (err) {
      setError("Failed to validate referral code");
    } finally {
      setIsValidatingReferral(false);
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to continue");
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];
      const message = "Please sign this message to authenticate with our service";

      const signature = await web3.eth.personal.sign(
        message,
        walletAddress,
        ""
      );

      const response = await axios.post("http://localhost:5000/api/auth", {
        walletAddress,
        signature,
        referralCode: referralCode || undefined,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("walletAddress", response.data.walletAddress);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

    return (
    <div className="container">
      {/* Video Background */}
      <div className="video-container">
        <video
          ref={videoRef}
          className="video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/auth-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Auth Card */}
      <div className="card">
        <div className="logo-container">
          <img 
            src="https://cdn.cdnlogo.com/logos/m/79/metamask.svg" 
            alt="MetaMask Logo" 
            className="logo" 
          />
        </div>
        <h2 className="heading">Connect with MetaMask</h2>
        <p className="subheading">
          Secure blockchain authentication for your digital assets
        </p>

        {/* Referral Section */}
        <div className="referral-section">
          <label className="label">Referral Code (Optional)</label>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter your referral code"
              value={referralCode}
              onChange={(e) => {
                setReferralCode(e.target.value);
                setReferrer(null);
              }}
              className="input"
              disabled={isLoading || isValidatingReferral}
            />
          </div>
          
          {isValidatingReferral && (
            <p className="loading-text">
              <span className="spinner"></span> Validating referral code...
            </p>
          )}
          
          {referrer && (
            <div className="referrer-container">
              <p className="referrer-text">
                <span className="checkmark">✓</span> Referred by: {referrer.walletAddress.substring(0, 6)}...
                {referrer.walletAddress.substring(38)}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleAuth}
          disabled={isLoading || isValidatingReferral}
          className={`button ${(isLoading || isValidatingReferral) ? 'button:disabled' : ''}`}
        >
          {isLoading ? (
            <>
              <span className="button-spinner"></span>
              Connecting...
            </>
          ) : (
            "Connect Wallet"
          )}
        </button>

        {error && (
          <div className="error-container">
            <p className="error">{error}</p>
          </div>
        )}

        <div className="auth-footer">
          <p className="terms-text">
            By connecting, you agree to our <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskAuth;

