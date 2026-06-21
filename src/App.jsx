import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import QuizStartPage from './pages/QuizStartPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import QuizPreviewPage from './pages/QuizPreviewPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="quiz/start" element={<QuizStartPage />} />
        <Route path="quiz" element={<QuizPage />} />
        {/* Dev/local-only preview of data/question_bank_draft.json — no Supabase.
            Gated on import.meta.env.DEV so it is absent from production builds
            (Vite statically replaces DEV with false, tree-shaking the page out). */}
        {import.meta.env.DEV && (
          <Route path="quiz/preview" element={<QuizPreviewPage />} />
        )}
        <Route path="results" element={<ResultsPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>
    </Routes>
  );
}
