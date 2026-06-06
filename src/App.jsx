import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import QuizStartPage from './pages/QuizStartPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="quiz/start" element={<QuizStartPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>
    </Routes>
  );
}
