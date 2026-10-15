import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthContextProvider, AuthRouterMiddleware } from './auth/auth';
import { AdminLayout } from './components/AdminLayout/AdminLayout';

const Login = lazy(() => import('./pages/login/Login'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Logos = lazy(() => import('./pages/logos/Logos'));
const CustomerFeedbacks = lazy(
  () => import('./pages/customer-feedbacks/CustomerFeedbacks'),
);
const BlogPosts = lazy(() => import('./pages/blog-posts/BlogPosts'));
const About = lazy(() => import('./pages/about/About'));
const Feedbacks = lazy(() => import('./pages/feedbacks/Feedbacks'));
const SiteContent = lazy(() => import('./pages/site-content/SiteContent'));
const MediaGallery = lazy(() => import('./pages/media/MediaGallery'));
const LegalContent = lazy(() => import('./pages/legal-content/LegalContent'));

function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-orvian-charcoal text-orvian-lavender">
      Carregando…
    </div>
  );
}

function AppRoutes() {
  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="logos" element={<Logos />} />
          <Route path="customer-feedbacks" element={<CustomerFeedbacks />} />
          <Route path="blog-posts" element={<BlogPosts />} />
          <Route path="about" element={<About />} />
          <Route path="feedbacks" element={<Feedbacks />} />
          <Route path="site-content" element={<SiteContent />} />
          <Route path="media" element={<MediaGallery />} />
          <Route path="legal-content" element={<LegalContent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL || '/'}
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <AuthContextProvider>
        <AuthRouterMiddleware
          authenticatedComponent={<AppRoutes />}
          unauthenticatedComponent={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
          errorComponent={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
