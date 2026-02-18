import { Link } from 'react-router-dom';
import { Radio, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 */}
        <div className="relative mb-8">
          <div className="text-[150px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#00D084]/50 to-transparent">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Radio className="w-16 h-16 text-[#00D084]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-[#9AA3B2] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00D084] text-[#070B14] rounded-xl font-semibold hover:bg-[#00E090] transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
