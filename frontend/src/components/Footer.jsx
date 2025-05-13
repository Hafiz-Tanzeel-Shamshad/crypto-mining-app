import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-brand">
            <h2>
              <a href="https://kinzoo.xyz" target="_blank" rel="noopener noreferrer">
                Kinzoo Protocol
              </a>
            </h2>
            <p className="footer-tagline"></p>
          </div>
          
          <div className="footer-links">
            <ul>
              <li><a href="https://kinzoo.xyz/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="https://kinzoo.xyz/terms-privacy/" target="_blank" rel="noopener noreferrer">Terms & Conditions</a></li>
              <li><a href="https://doc.kinzoo.xyz/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-right">
          <h3 className='footer-right-heading '>Connect With Us</h3>
          <div className="social-links">
            <a href="https://discord.gg/2tzC6SzuMN" target="_blank" rel="noopener noreferrer" className="social-icon discord">
              <i className="fab fa-discord"></i>
            </a>
            <a href="https://x.com/Kinzoo_Protocol" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://t.me/kinzoonews" target="_blank" rel="noopener noreferrer" className="social-icon telegram">
              <i className="fab fa-telegram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Kinzoo Protocol. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;