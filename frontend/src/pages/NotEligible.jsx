import React from 'react';
import { Link } from 'react-router-dom';
import backgroundVideo from '/videos/auth-background.mp4'; // adjust path if needed

const NotEligible = () => {
  // Styles
  const containerStyle = {
    position: 'relative',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const videoStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
  };

  const overlayStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
  };

  const cardStyle = {
    maxWidth: '500px',
    width: '100%',
    background: 'rgba(23, 25, 35, 0.9)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  };

  const innerStyle = {
    padding: '32px',
  };

  const iconWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  };

  const iconContainerStyle = {
    height: '80px',
    width: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const headingStyle = {
    fontSize: '28px',
    fontWeight: '700',
    textAlign: 'center',
    margin: '0 0 8px 0',
    color: '#ffffff',
  };

  const lineStyle = {
    height: '3px',
    width: '64px',
    margin: '16px auto',
    background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
    borderRadius: '3px',
  };

  const messageStyle = {
    fontSize: '18px',
    fontWeight: '600',
    textAlign: 'center',
    margin: '0 0 24px 0',
    color: '#e2e8f0',
  };

  const infoBoxStyle = {
    backgroundColor: 'rgba(39, 51, 89, 0.4)',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    textAlign: 'center',
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const buttonBaseStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '10px',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    border: 'none',
    outline: 'none',
  };

  const nftButtonStyle = {
    ...buttonBaseStyle,
    background: 'linear-gradient(90deg, #7c3aed 0%, #6366f1 100%)',
    color: '#ffffff',
    boxShadow: '0 2px 10px rgba(124, 58, 237, 0.3)',
  };

  const loginButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
  };

  const footerStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '16px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#94a3b8',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  };

  const linkStyle = {
    color: '#a78bfa',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  };

  // Event handlers
  const handleNftButtonHover = (e, isHover) => {
    e.currentTarget.style.background = isHover 
      ? 'linear-gradient(90deg, #6d28d9 0%, #4f46e5 100%)' 
      : 'linear-gradient(90deg, #7c3aed 0%, #6366f1 100%)';
    e.currentTarget.style.boxShadow = isHover 
      ? '0 4px 14px rgba(124, 58, 237, 0.4)' 
      : '0 2px 10px rgba(124, 58, 237, 0.3)';
  };

  const handleLoginButtonHover = (e, isHover) => {
    e.currentTarget.style.backgroundColor = isHover 
      ? 'rgba(255, 255, 255, 0.12)' 
      : 'rgba(255, 255, 255, 0.08)';
  };

  const handleLinkHover = (e, isHover) => {
    e.currentTarget.style.color = isHover ? '#c4b5fd' : '#a78bfa';
  };

  return (
    <div style={containerStyle}>
      <video autoPlay muted loop playsInline style={videoStyle}>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div style={overlayStyle}>
        <div style={cardStyle}>
          <div style={innerStyle}>
            <div style={iconWrapperStyle}>
              <div style={iconContainerStyle}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  width="40" 
                  height="40" 
                  style={{ color: '#ef4444' }}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
            </div>

            <h2 style={headingStyle}>Access Denied</h2>
            <div style={lineStyle}></div>

            <p style={messageStyle}>You are not eligible to access this application</p>

            <div style={infoBoxStyle}>
              NFT ownership required. You must own at least one NFT from our collection to access the platform.
            </div>

            <div style={buttonContainerStyle}>
              <a
                href="https://opensea.io/"
                target="_blank"
                rel="noopener noreferrer"
                style={nftButtonStyle}
                onMouseEnter={(e) => handleNftButtonHover(e, true)}
                onMouseLeave={(e) => handleNftButtonHover(e, false)}
              >
                Purchase NFT
              </a>

              <Link
                to="/"
                style={loginButtonStyle}
                onMouseEnter={(e) => handleLoginButtonHover(e, true)}
                onMouseLeave={(e) => handleLoginButtonHover(e, false)}
              >
                Back to Login
              </Link>
            </div>
          </div>

          <div style={footerStyle}>
            If you believe this is an error, please contact our support team at{' '}
            <a 
              href="mailto:support@example.com" 
              style={linkStyle}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              support@example.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotEligible;