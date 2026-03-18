'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Users,
  ClipboardList,
  Wand2,
  BookOpen,
  Settings,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { label: 'Home', icon: LayoutGrid, href: '/' },
  { label: 'My Groups', icon: Users, href: '/groups' },
  { label: 'Assignments', icon: ClipboardList, href: '/assignments' },
  { label: 'AI Teacher\'s Toolkit', icon: Wand2, href: '/toolkit' },
  { label: 'My Library', icon: BookOpen, href: '/library', badge: 52 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden md:flex flex-col w-[210px] min-w-[210px] bg-white border-r border-gray-100 h-full">
        <div className="p-5 pb-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-[#1C1917] text-lg">VedaAI</span>
          </div>

          <Link href="/assignments/create">
            <button className="w-full flex items-center justify-center gap-2 bg-[#1C1917] text-white rounded-full py-2.5 px-4 text-sm font-medium hover:bg-[#2d2926] transition-colors">
              <Sparkles size={14} />
              Create Assignment
            </button>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/assignments'
                ? pathname.startsWith('/assignments')
                : pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-[#1C1917]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} strokeWidth={1.8} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-brand text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer mb-2">
            <Settings size={17} strokeWidth={1.8} />
            <span className="text-sm font-medium">Settings</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
              <span className="text-xs font-bold text-brand">D</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1C1917] truncate">Delhi Public School</p>
              <p className="text-[10px] text-gray-400 truncate">Bokaro Steel City</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-50">
        {[
          { label: 'Home', icon: LayoutGrid, href: '/' },
          { label: 'My Groups', icon: Users, href: '/groups' },
          { label: 'Library', icon: BookOpen, href: '/library' },
          { label: 'AI Toolkit', icon: Wand2, href: '/toolkit' },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className="flex flex-col items-center py-3 gap-1">
                <Icon
                  size={20}
                  className={isActive ? 'text-brand' : 'text-gray-400'}
                  strokeWidth={1.8}
                />
                <span className={`text-[10px] ${isActive ? 'text-brand font-medium' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}