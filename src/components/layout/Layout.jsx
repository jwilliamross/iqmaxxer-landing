import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  return (
    <div className="lp">
      <div className="lp-scroll">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
