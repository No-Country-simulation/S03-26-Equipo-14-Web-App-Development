import { LandingNavbar } from '@/app/(landing)/_components/landing-navbar';
import { Label } from '@repo/ui/components';
import Link from 'next/link';
import React from 'react';

interface LayoutAsideDocsProps {
  children: React.ReactNode;
}

interface Route {
  path: string;
  name: string;
}

const routes: Route[] = [
  {
    name: "Introduction",
    path: "/docs"
  },
  {
    name: 'Api Reference',
    path: '/docs/api-reference',
  },
  {
    name: 'Component UI Library',
    path: '/docs/component-library',
  },
  {
    name: 'Widgets (Scripts)',
    path: '/docs/widgets',
  },
];
export default function LayoutAsideDocs({ children }: LayoutAsideDocsProps) {
  return (
    // 'min-h-screen' asegura que ocupe toda la pantalla
    <div className="w-full min-h-screen flex flex-col">
      <header>
        <LandingNavbar />
      </header>

      {/* 'flex-1' hace que este div crezca para llenar el espacio sobrante */}
      <div className="flex flex-1 m-5 gap-4">
        <aside className="w-1/5 bg-gray-100 flex flex-col justify-start items-start rounded-xl">
          <div className="w-[90%] py-10 pl-5 sticky top-5 py-10 space-y-5">
            {routes.map((route, idx) => (
              <div key={idx} className="p-2 flex items-center hover:bg-primary hover:text-background w-full rounded-xl inline-block transform transition-all duration-500 ease-in-out hover:scale-105 hover:pr-5  ">
                <Link href={route.path}>
                  <Label className="text-lg font-semibold">{route.name}</Label>
                </Link>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-25 bg-gray-100 font-bold rounded-lg">{children}</main>
      </div>
    </div>
  );
}
