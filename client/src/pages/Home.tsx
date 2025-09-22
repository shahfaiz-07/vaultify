import { Link } from "react-router";

const Home = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Smart File Management",
      description: "Organize, upload, and manage your files with ease. Support for images, videos, PDFs, and more."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7c0 2.21-3.582 4-8 4s-8-1.79-8-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      title: "Intelligent Deduplication",
      description: "Save storage space automatically with our smart deduplication technology that eliminates duplicate files."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Privacy Control",
      description: "Choose between public and private file sharing. You control who can access your files."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Upload and download files at blazing speeds with our optimized cloud infrastructure."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Analytics & Insights",
      description: "Track downloads, monitor usage, and get insights into your file management patterns."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
        </svg>
      ),
      title: "Cross-Platform Access",
      description: "Access your files from anywhere, on any device. Responsive design for desktop and mobile."
    }
  ];

  const stats = [
    { value: "10K+", label: "Files Uploaded", icon: "📁" },
    { value: "500+", label: "Active Users", icon: "👥" },
    { value: "99.9%", label: "Uptime", icon: "⚡" },
    { value: "5TB+", label: "Storage Saved", icon: "💾" }
  ];

  const fileTypes = [
    { name: "Images", icon: "🖼️", formats: "JPG, PNG, GIF, WebP" },
    { name: "Videos", icon: "🎥", formats: "MP4, WebM, AVI" },
    { name: "Documents", icon: "📄", formats: "PDF, DOC, TXT" },
    { name: "Archives", icon: "📦", formats: "ZIP, RAR, 7Z" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="hero-content text-center max-w-6xl px-4">
          <div>
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="flex justify-center items-center gap-4 mb-4">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-loose">
                  Vaultify
                </h1>
              </div>
              <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                The smart cloud storage solution that automatically eliminates duplicates, saves space, and keeps your files organized and accessible.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/register" className="btn btn-primary btn-lg px-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg px-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-base-100/50 backdrop-blur rounded-lg border border-base-300/30">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-base-content/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 bg-base-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">
              Powerful Features for Modern File Management
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Discover why thousands of users trust Vaultify for their file storage and management needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow border border-base-300/30">
                <div className="card-body text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-base-content mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* File Types Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">
              Support for All File Types
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Upload and manage any file type with confidence. Our platform supports a wide range of formats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fileTypes.map((type, index) => (
              <div key={index} className="card bg-base-100 shadow-lg border border-base-300/30">
                <div className="card-body text-center">
                  <div className="text-4xl mb-3">{type.icon}</div>
                  <h3 className="text-lg font-semibold text-base-content mb-2">
                    {type.name}
                  </h3>
                  <p className="text-sm text-base-content/60">
                    {type.formats}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-base-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">
              How Vaultify Works
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Get started in three simple steps and experience the power of intelligent file management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-content font-bold text-xl">
                    1
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">
                Create Your Account
              </h3>
              <p className="text-base-content/70">
                Sign up for free and get instant access to your personal cloud storage vault.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-secondary/10 rounded-full">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-secondary-content font-bold text-xl">
                    2
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">
                Upload Your Files
              </h3>
              <p className="text-base-content/70">
                Drag and drop or browse to upload files. Our system automatically handles deduplication.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-accent/10 rounded-full">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-content font-bold text-xl">
                    3
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">
                Manage & Share
              </h3>
              <p className="text-base-content/70">
                Organize your files, control privacy settings, and share with others effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center text-primary-content">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your File Management?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have already discovered the power of intelligent cloud storage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-accent btn-lg px-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Free Today
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg px-8 text-white border-white hover:bg-white hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Already Have Account?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-base-content">Vaultify</h3>
              </div>
              <p className="text-base-content/70 max-w-md mb-4">
                The smart cloud storage solution that saves space and keeps your files organized. Experience the future of file management today.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/shahfaiz-07" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-circle btn-ghost hover:bg-base-content/10 transition-colors"
                  title="GitHub Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-base-content mb-4">Features</h4>
              <ul className="space-y-2 text-base-content/70">
                <li>File Upload</li>
                <li>Smart Deduplication</li>
                <li>Privacy Controls</li>
                <li>File Analytics</li>
                <li>Cross-Platform Access</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-base-content mb-4">Support</h4>
              <ul className="space-y-2 text-base-content/70">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Contact Support</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="divider"></div>

          <div className="text-center text-base-content/60">
            <p>&copy; 2025 Vaultify. All rights reserved. Built with ❤️ for better file management.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;