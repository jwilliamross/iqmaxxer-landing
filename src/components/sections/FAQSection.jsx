import { Reveal, FAQ } from '../widgets.jsx';

export default function FAQSection() {
  return (
    <section className="sec">
      <Reveal>
        <div className="eyebrow">FAQ</div>
        <h2 className="title">Frequently asked.</h2>
      </Reveal>
      <FAQ />
    </section>
  );
}
