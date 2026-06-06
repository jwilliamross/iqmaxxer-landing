# IQMaxxer — Landing Page (React + Vite)

A mobile-first marketing landing page for **IQMaxxer**, rendered inside an iOS device frame. Built with React 18 and Vite.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

### Other scripts
- `npm run build` — production build into `dist/`
- `npm run preview` — preview the production build locally

## What's inside

- **Hero** with the IQ → income comparison chart (animated bars + count-up figures)
- **Sliding press marquee**, animated stat band
- **How it works**, **Available tests**, dark **Boost your abilities**, swipeable **What you'll get**
- **Auto-advancing reviews** carousel + Trustpilot line
- **FAQ** accordion, community + footer
- **Sticky bottom CTA** that reveals on scroll
- **Start Test modal** — a 3-step interactive flow: email capture (with validation) → warm-up question → "analyzing" → teaser percentile reveal

## Project structure

```
index.html                 # Vite entry; loads Google Fonts (Manrope + JetBrains Mono)
vite.config.js
src/
  main.jsx                 # mounts <App/> inside the iOS device frame
  App.jsx                  # full landing page layout
  styles.css               # all styles (design tokens + components)
  hooks/
    useInView.js           # fire-once IntersectionObserver hook
  components/
    IOSDevice.jsx          # iPhone device frame (status bar, island, home indicator)
    Brand.jsx              # logo mark + wordmark
    icons.jsx              # inline SVG icon set
    widgets.jsx            # Reveal, CountUp, PressMarquee, Reviews, FAQ, IncomeChart, BellCurve, Stars
    StartModal.jsx         # interactive Start Test flow
```

## Notes

- Fonts load from Google Fonts via `index.html`. No other network dependencies.
- Stats, press logos, reviews and the IQ→income figures are illustrative placeholders — swap in real, sourced data before any public launch.
- `BellCurve` is included in `widgets.jsx` for reuse but is not currently rendered on the page.
- The test is presented for entertainment/educational purposes and is not a substitute for professional evaluation.
