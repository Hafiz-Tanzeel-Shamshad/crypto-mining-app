import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MetaMaskAuth from './components/MetaMaskAuth.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MetaMaskAuth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;



// import { lazy } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// const Dashboard = lazy(() => import('./components/Dashboard.jsx'));
// import MetaMaskAuth from './components/MetaMaskAuth.jsx';
// import ContractAddressCheck from './components/ContractAddressCheck.jsx';
// import NotEligible from './pages/NotEligible.jsx';
// import NotFoundPage from './pages/NotFoundPage.jsx';

// function App() {
//   return (
//     <Router>
      
//         <Routes>
//           <Route path="/" element={<MetaMaskAuth />} />

//           <Route
//             path="/dashboard"
//             element={
//               <ContractAddressCheck>
//                 <Dashboard />
//               </ContractAddressCheck>
//             }
//           />

//           <Route path="/not-eligible" element={<NotEligible />} />

//           <Route path='*' element={<NotFoundPage />}/>
//         </Routes>
      
//     </Router>
//   );
// }

// export default App;

