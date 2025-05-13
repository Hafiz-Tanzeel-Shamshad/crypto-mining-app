import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/dashboard" className="back-button">
          Return to Dashboard
        </Link>
      </div>
      
      <style jsx>{`
        .not-found {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #1a1a2e;
          color: white;
          text-align: center;
        }
        
        .not-found-content {
          max-width: 500px;
          padding: 40px;
        }
        
        h1 {
          font-size: 8rem;
          margin: 0;
          color: #4f46e5;
          text-shadow: 0 0 10px rgba(79, 70, 229, 0.5);
        }
        
        h2 {
          font-size: 2.5rem;
          margin-top: 0;
          margin-bottom: 20px;
        }
        
        p {
          font-size: 1.2rem;
          margin-bottom: 30px;
          color: #aaa;
        }
        
        .back-button {
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .back-button:hover {
          background-color: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(79, 70, 229, 0.4);
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;