import { Link } from 'react-router-dom';
import { Radio, Twitter, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    stations: [
      { label: 'Night Drive', href: '/station/night-drive' },
      { label: 'Neon Workout', href: '/station/neon-workout' },
      { label: 'Deep Focus', href: '/station/deep-focus' },
      { label: 'View All', href: '/' },
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Careers', href: '#' },
    ],
    legal: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: MessageCircle, href: '#', label: 'Discord' },
  ];

  return (
    <footer className="bg-[#0F1623] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Emerald Radio Logo"
                className="h-10 w-auto object-contain"
                loading="lazy"
              />
              <div>
                <h1 className="font-bold text-lg leading-tight">Emerald</h1>
                <p className="text-xs text-[#9AA3B2]">Radio</p>
              </div>
            </Link>
            <p className="text-[#9AA3B2] text-sm max-w-sm mb-6">
              A 24/7 synchronized multi-station radio platform. Experience music together—every listener hears the same beat at the same moment.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#9AA3B2] hover:bg-[#00D084]/10 hover:text-[#00D084] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Stations */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Stations</h3>
            <ul className="space-y-2">
              {footerLinks.stations.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#9AA3B2] hover:text-[#F2F5FA] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#9AA3B2] hover:text-[#F2F5FA] text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#9AA3B2] hover:text-[#F2F5FA] text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#9AA3B2] text-sm">
            {currentYear} Emerald Radio. All rights reserved.
          </p>
          <p className="text-[#9AA3B2] text-xs">
            Powered by YouTube • Built with React & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
