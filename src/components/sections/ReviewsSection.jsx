import { Reveal, Reviews } from '../widgets.jsx';

export default function ReviewsSection() {
  return (
    <section className="sec">
      <Reveal>
        <div className="eyebrow">Reviews</div>
        <h2 className="title">Trusted by sharp minds.</h2>
      </Reveal>
      <Reviews />
    </section>
  );
}
