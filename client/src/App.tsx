import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/common/Navbar";
import { AdminRoute, FilePreview, Files, Layout, MyFiles, PrivateRoute, Profile, PublicRoute, Stats, ThemeSwitcher, UploadFile, Users, UserStat } from "./components";
import PublicFiles from "./components/Dashboard/PublicFiles";
import useThemeStore from "./store/themeStore";

const queryClient = new QueryClient();

function App() {
  const { theme } = useThemeStore();
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="app min-h-screen flex flex-col" data-theme={theme}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={
              <Home />
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>}>
              <Route path="" element={
                <Profile />
              } />
              <Route path="my-files" element={
                <MyFiles />
              } />
              <Route path="public-files" element={
                <PublicFiles />
              } />
              <Route path="profile" element={
                <PublicFiles />
              }/>
              <Route path="upload-file" element={
                <UploadFile />
              } />
              <Route path="file/:fileId" element={
                <FilePreview />
              }/>
              <Route path="theme" element={
                <ThemeSwitcher />
              }/>
              <Route path="admin/users" element={
                <AdminRoute>
                  <Users />
                </AdminRoute>
              } />
              <Route path="admin/users/:userId" element={
                <AdminRoute>
                  <UserStat />
                </AdminRoute>
              } />
              <Route path="admin/files" element={
                <AdminRoute>
                  <Files />
                </AdminRoute>
              }/>
              <Route path="admin/stats" element={
                <AdminRoute>
                  <Stats />
                </AdminRoute>
              }/>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
