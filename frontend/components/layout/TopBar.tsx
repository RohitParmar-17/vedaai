'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LayoutGrid, Bell, ChevronDown } from 'lucide-react';

const getTitleFromPath = (pathname: string) => {
  if (pathname.includes('/create')) return 'Create New';
  if (pathname.includes('/assignments/')) return 'Assignment';
  if (pathname.includes('/assignments')) return 'Assignment';
  return 'Home';
};

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = getTitleFromPath(pathname);

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft size={18} />
        </button>
        <LayoutGrid size={18} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell size={20} className="text-gray-500 cursor-pointer hover:text-gray-700" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full" />
        </div>
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-orange-300 to-brand flex items-center justify-center">
              <span className="text-white text-xs font-bold">J</span>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
          <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}