import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MiniPlayer from '@/components/player/MiniPlayer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#070B14] text-[#F2F5FA] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MiniPlayer />
    </div>
  );
};

export default MainLayout;
