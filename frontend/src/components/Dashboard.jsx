import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import FAQ from './FAQ';

// Declare your environment variable here, after the imports
const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [miningStatus, setMiningStatus] = useState('Not Started');
  const [timeRemaining, setTimeRemaining] = useState('00:00:00');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [referralLink, setReferralLink] = useState('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    referralPoints: 0,
    referredBy: null
  });

  const navigate = useNavigate();
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const circleRef = useRef(null);
  const radius = 90;
  const circumference = radius * 2 * Math.PI;

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/');

      const { data: userData } = await axios.get(`${apiUrl}/api/dashboard/user`, {
        headers: { 'x-auth-token': token }
      });

      const { data: referralData } = await axios.get(`${apiUrl}/api/dashboard/referral-stats`, {
        headers: { 'x-auth-token': token }
      });

      setUser(userData);
      setReferralStats(referralData);
      setReferralLink(`${window.location.origin}/?ref=${userData.referralCode}`);
      setPointsEarned(userData.currentPoints);

      if (userData.miningStartTime) {
        const start = new Date(userData.miningStartTime);
        const now = new Date();
        const elapsed = now - start;

        if (elapsed < 24 * 60 * 60 * 1000) {
          setMiningStatus('In Progress');
          startTimeRef.current = start;
          startTimer(start);
        } else {
          setMiningStatus('Completed - Ready to Start Again');
        }
      } else {
        setMiningStatus('Not Started');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error loading dashboard');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const updateMiningProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${apiUrl}/api/dashboard/update-mining-progress`,
        {},
        { headers: { 'x-auth-token': token } }
      );

      if (data.success) {
        setPointsEarned(data.currentPoints);
        setUser(prev => ({
          ...prev,
          currentPoints: data.currentPoints,
          totalPoints: data.totalPoints
        }));

        if (data.miningStatus === 'completed') {
          clearInterval(timerRef.current);
          setMiningStatus('Completed - Ready to Start Again');
          setTimeRemaining('00:00:00');
          if (circleRef.current) {
            circleRef.current.style.strokeDashoffset = 0;
          }
        }
      }
    } catch (err) {
      console.error('Mining progress update failed:', err);
    }
  };
  // call it once when component mounts
  useEffect(() => {
    updateMiningProgress();
  }, [updateMiningProgress]);
  
  const startTimer = (startTime) => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = new Date();
      const elapsedMs = now - startTime;
      const remainingMs = 24 * 60 * 60 * 1000 - elapsedMs;

      if (remainingMs <= 0) {
        clearInterval(timerRef.current);
        setMiningStatus('Completed - Ready to Start Again');
        setTimeRemaining('00:00:00');
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = 0;
        }
        return;
      }

      // Update progress ring
      const progress = remainingMs / (24 * 60 * 60 * 1000);
      const offset = circumference - progress * circumference;
      if (circleRef.current) {
        circleRef.current.style.strokeDashoffset = offset;
      }

      const h = String(Math.floor(remainingMs / 3600000)).padStart(2, '0');
      const m = String(Math.floor((remainingMs % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, '0');
      setTimeRemaining(`${h}:${m}:${s}`);

      // Sync update at exact minute mark (seconds === 59)
      if (s === '59') {
        updateMiningProgress();
      }

    }, 1000);
  };

  const handleStartMining = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${apiUrl}/api/dashboard/start-mining`,
        {},
        { headers: { 'x-auth-token': token } }
      );

      if (data.success) {
        setMiningStatus('In Progress');
        const now = new Date();
        startTimeRef.current = now;
        startTimer(now);
        await fetchUser();
      }
    } catch (err) {
      console.error("Start mining failed:", err);
      setError(err.response?.data?.message || 'Could not start mining');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const formatWalletAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : 'None';

  useEffect(() => {
    fetchUser();
    return () => clearInterval(timerRef.current);
  }, [fetchUser]);

  if (loading) return (
    <div className="dashboard-container">
      <div className="loading-spinner">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="dashboard-container">
      <div className="error-message">Error: {error}</div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>KINZOO PROTOCOL</h1>
        <div className="user-info">
          <span className="user-address">{formatWalletAddress(user.walletAddress)}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-grid">
          {/* Mining Card */}
          <section className="mining-card">
            {/* Video Background */}
            <div className="video-background">
              <video autoPlay loop muted playsInline preload="auto">
                <source src="/videos/mining-background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay"></div>
            </div>

            {/* Card Content */}
            <div className="mining-content">
              <h2 >KINZOO ENERGY</h2>
              <div className={`mining-status ${miningStatus.includes('Progress') ? 'in-progress' :
                miningStatus.includes('Completed') ? 'completed' : 'not-started'
                }`}>
                {miningStatus}
              </div>

              {miningStatus === 'In Progress' && (
                <>
                  <div className="progress-container">
                    <svg className="progress-ring" viewBox="0 0 220 220">
                      <circle className="progress-ring__circle-bg" r="90" cx="110" cy="110" />
                      <circle
                        ref={circleRef}
                        className="progress-ring__circle-fill"
                        r="90"
                        cx="110"
                        cy="110"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={circumference}
                      />
                    </svg>
                    <div className="progress-info">
                      <p className="progress-time">{timeRemaining}</p>
                      <p className="progress-label">Time Remaining</p>
                    </div>
                  </div>
                  {/* <div className="stat-item">
                    <p className="stat-label">Current Points</p>
                    <p className="stat-value">{pointsEarned}</p>
                  </div> */}
                </>
              )}

              {miningStatus !== 'In Progress' && (
                <button
                  className="btn-primary"
                  onClick={handleStartMining}
                  disabled={loading}
                >
                  {loading ? 'Starting...' : 'Start 24h Mining Session'}
                </button>
              )}
            </div>
          </section>

          {/* Stats Card */}
          <section className="stats-card">
            {/* Video Background */}
            <div className="video-background">
              <video autoPlay loop muted playsInline preload="auto">
                <source src="/videos/mining-background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay"></div>
            </div>

            {/* Card Content */}
            <div className="stats-content">
              <h2>ENERGY STATISTICS</h2>

              <div className="stats-grid">
                <div className="stat-item">
                  <p className="stat-label">TOTAL ENERGY</p>
                  <p className="stat-value">{user.totalPoints}</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">INVITE ENERGY</p>
                  <p className="stat-value">{referralStats.referralPoints}</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">CURRENT ENERGY</p>
                  <p className="stat-value">{pointsEarned}</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">TOTAL INVITE</p>
                  <p className="stat-value">{referralStats.totalReferrals}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Referral Card */}
          <section className="referral-card">
            {/* Video Background */}
            <div className="video-background">
              <video autoPlay loop muted playsInline preload="auto">
                <source src="/videos/mining-background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay"></div>
            </div>

            {/* Card Content */}
            <div className="referral-content">
              <h2>INCREASE ENERGY</h2>
              <div className="referral-code">{user.referralCode}</div>

              <div className="referral-info">
                <span className="referral-label">Referred By</span>
                <span className="referral-value">
                  {referralStats.referredBy ?
                    formatWalletAddress(referralStats.referredBy.walletAddress) : 'None'}
                </span>
              </div>

              <div className="referral-link-container">
                <input
                  className="referral-link"
                  value={referralLink}
                  readOnly
                  onClick={(e) => e.target.select()}
                />
                <button
                  className="btn-copy"
                  onClick={() => navigator.clipboard.writeText(referralLink)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </button>
              </div>

              <p className="referral-benefit">
                INVITE YOUR FRIENDS TO COLLECT <b>3000</b> ENERGY
              </p>
            </div>
          </section>
        </div>
      </main>
      <FAQ />
    </div>
  );
};

export default Dashboard;