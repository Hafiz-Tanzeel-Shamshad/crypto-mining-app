import React, { useState } from 'react';


const NFTNotificationBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMintClick = () => {
    // Replace with your actual minting functionality
    window.location.href = 'https://genesisnft.kinzoo.xyz/';
  };

  if (!isVisible) return null;

  return (
    <div className="nft-notification-bar">
      <div className="notification-content">
         <img src="/images/kng.jpg" alt="NFT Icon" className="nft-image" />
        <div className="notification-text">
          <h3>🚀 Genesis NFT Live - Mint it Free & Early!</h3>
          <p>Limited slots available - Don't miss your chance to own a piece of history!</p>
        </div>
        <div className="notification-actions">
          <button className="mint-button" onClick={handleMintClick}>
            Mint Now - FREE
          </button>
          <span className="timer">⏰ Limited Time Offer</span>
        </div>
      </div>
      <button className="close-button" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default NFTNotificationBar;

// CSS Styles
const styles = `
.nft-notification-bar {
  position: relative;
  margin: 20px auto;
  top: 0;
  left: 0;
  right: 0;
  width: 90%;
  max-width: 900px;
  background: linear-gradient(135deg, #6e00ff 0%, #ff00a8 100%);
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  animation: pulse 2s infinite;
  border: 2px solid rgba(255, 255, 255, 0.2);
}


.notification-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.nft-image {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  margin-right: 20px;
  border: 2px solid white;
  object-fit: cover;
}

.notification-text {
  flex: 1;
}

.notification-text h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 700;
}

.notification-text p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
}

.mint-button {
  background-color: #00ff88;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  box-shadow: 0 4px 15px rgba(0, 255, 136, 0.4);
}

.mint-button:hover {
  background-color: #00cc6a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 255, 136, 0.6);
}

.timer {
  font-size: 12px;
  opacity: 0.8;
  display: flex;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.7;
  margin-left: 15px;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 1;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(110, 0, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(110, 0, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(110, 0, 255, 0);
  }
}

@media (max-width: 768px) {
  .nft-notification-bar {
    flex-direction: column;
    padding: 15px;
    width: 95%;
  }
  
  .notification-content {
    flex-direction: column;
    text-align: center;
  }
  
  .nft-image {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .notification-actions {
    margin-left: 0;
    margin-top: 15px;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
`;

// Add styles to the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);