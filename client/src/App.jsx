import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import AdminLayout from './components/AdminLayout';
import PublicLayout from './components/PublicLayout';

const Home = lazy(() => import('./pages/Home'));
const Post = lazy(() => import('./pages/Post'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const LegalNotice = lazy(() => import('./pages/LegalNotice'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const EditPost = lazy(() => import('./pages/admin/EditPost'));
const Categories = lazy(() => import('./pages/admin/Categories'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="loader-container"><div className="loader"></div></div>}>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="post/:slug" element={<Post />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="cookie-policy" element={<CookiePolicy />} />
            <Route path="note-legali" element={<LegalNotice />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="login" element={<Login />} />
            <Route index element={<Dashboard />} />
            <Route path="post/new" element={<EditPost />} />
            <Route path="post/edit/:id" element={<EditPost />} />
            <Route path="categories" element={<Categories />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
