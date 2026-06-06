import { Mark, Wordmark } from '../Brand.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="fbrand">
        <Mark size={20} light />
        <Wordmark light />
      </div>
      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#92A2C0', margin: 0, maxWidth: '36ch' }}>
        Rigorous cognitive measurement, treated as your private property — encrypted on arrival, portable on demand.
      </p>
      <div className="cols">
        <div>
          <h5>Tests</h5>
          <a className="fl" href="#">IQ / Intelligence</a>
          <a className="fl" href="#">Personality type</a>
          <a className="fl" href="#">Career aptitude</a>
        </div>
        <div>
          <h5>Company</h5>
          <a className="fl" href="#">Help center</a>
          <a className="fl" href="#">How to cancel</a>
        </div>
        <div>
          <h5>Legal</h5>
          <a className="fl" href="#">Privacy policy</a>
          <a className="fl" href="#">Terms &amp; conditions</a>
          <a className="fl" href="#">Refund policy</a>
        </div>
        <div>
          <h5>Support</h5>
          <a className="fl" href="#">24/7/365 support</a>
          <a className="fl" href="#">Contact us</a>
        </div>
      </div>
      <div className="pays">
        <span className="pay">VISA</span>
        <span className="pay">MASTERCARD</span>
        <span className="pay">PayPal</span>
        <span className="pay">Apple Pay</span>
        <span className="pay">G Pay</span>
      </div>
      <p className="disc">
        © 2024–2026 IQMaxxer™. All trademarks referenced herein are the property of their respective owners. The test is for
        entertainment and educational purposes and is not a substitute for professional clinical evaluation.
      </p>
    </footer>
  );
}
