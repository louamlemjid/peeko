'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import {
  Home,
  Users,
  ChevronDown,
  ChevronRight,
  User,
  PanelLeftOpen,
  Pencil,
  PlusCircle,
  HandPlatter,
  MapPin,
  Dog
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [focus, setFocus] = useState('');
  const [animationsOpen, setAnimationsOpen] = useState(false);
  const [animationSetOpen, setAnimationSetOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [zoneOpen,setZoneOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/animation', label: 'Animations', icon: Dog },
    { href: '/dashboard/animationSet', label: 'AnimationSet', icon: Users },
    { href: '/dashboard/service', label: 'Services', icon: HandPlatter },
    { href: '/dashboard/zonesDesservies', label: 'zonesDesservies', icon: MapPin },
  ];

  const centerSubItems = [
    { href: '/dashboard/animation/editAnimation', label: 'Gerer animations', icon: Pencil },
    { href: '/dashboard/animation/createAnimation', label: 'Ajouter animations', icon: PlusCircle },
  ];

  const blogSubItems = [
    { href: '/dashboard/animationSet/editAnimationSet', label: 'Gerer AnimationSet', icon: Pencil },
    { href: '/dashboard/animationSet/createAnimationSet', label: 'Ajouter AnimationSet', icon: PlusCircle },
  ];

  const serviceSubItems = [
    { href: '/dashboard/service/editService', label: 'Gerer services', icon: Pencil },
    { href: '/dashboard/service/createService', label: 'Ajouter services', icon: PlusCircle },
  ];

  const zoneSubItems = [
    { href: '/dashboard/zonesDesservies/editZone', label: 'Gerer zones', icon: Pencil },
    { href: '/dashboard/zonesDesservies/createZone', label: 'Ajouter zones', icon: PlusCircle },
  ];

  return (
    <div
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } h-full bg-gradient-to-b from-white/70 to-white/90 text-black border-r border-gray-200 transition-all duration-300 ease-in-out px-4`}
    >
      {/* Toggle */}
      <div className="border-b-2 border-blue-400 py-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center rounded-lg transition-all duration-200 group hover:cursor-pointer"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="text-slate-900 group-hover:text-blue-400" />
          ) : (
            <Image
              src="/6fd34383dcc18aa07775bf1f62af2ec1.gif"
              alt="Logo"
              width={140}
              height={40}
              className="rounded-4xl hover:shadow-xl"
              priority
            />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="border-b-2 border-blue-400 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            if (item.label === 'Centres') {
              return (
                <div key={item.label}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isCollapsed) setIsCollapsed(false);
                      setAnimationsOpen(!animationsOpen);
                      setAnimationSetOpen(false);
                      setServiceOpen(false)
                      setZoneOpen(false)
                      setFocus(''); // clear focus when toggling parent
                    }}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-gradient-to-r from-sky-300 to-purple-300 transition
                    ${
                      animationsOpen && !focus.startsWith('/dashboard/center/')
                        ? 'bg-gradient-to-r from-purple-300 to-sky-300 text-white shadow-3xl'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Dog />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      animationsOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )
                    )}
                  </button>

                  {/* Submenu */}
                  {animationsOpen && !isCollapsed && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {centerSubItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => {
                            setFocus(sub.href);
                          }}
                          className={`block text-slate-700 hover:text-white hover:bg-gradient-to-r from-sky-300 to-purple-300 p-1.5 rounded-md transition 
                          ${
                            focus === sub.href
                              ? 'bg-gradient-to-r from-purple-300 to-sky-300 text-white shadow-3xl'
                              : ''
                          }`}
                        >
                          <sub.icon className="inline-block mr-2" />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else if (item.label === 'Blogs') {
              return (
                <div key={item.label}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isCollapsed) setIsCollapsed(false);
                      setAnimationSetOpen(!animationSetOpen);
                      setAnimationsOpen(false);
                      setServiceOpen(false)
                      setZoneOpen(false)
                      setFocus(''); // clear focus when toggling parent
                    }}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-gradient-to-r from-sky-300 to-purple-300 transition
                    ${
                      animationSetOpen && !focus.startsWith('/dashboard/blog/')
                        ? 'bg-gradient-to-r from-purple-300 to-sky-300 text-white shadow-3xl'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      animationSetOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )
                    )}
                  </button>

                  {/* Submenu */}
                  {animationSetOpen && !isCollapsed && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {blogSubItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => {
                            setFocus(sub.href);
                          }}
                          className={`block text-slate-700 hover:text-white hover:bg-gradient-to-r from-sky-300 to-purple-300 p-1.5 rounded-md transition 
                          ${
                            focus === sub.href
                              ? 'bg-gradient-to-r from-purple-300 to-sky-300 text-white shadow-3xl'
                              : ''
                          }`}
                        >
                          <sub.icon className="inline-block mr-2" />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }else if (item.label === 'Services') {
              return (
                <div key={item.label}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isCollapsed) setIsCollapsed(false);
                      setServiceOpen(!serviceOpen);
                      setAnimationsOpen(false);
                      setAnimationSetOpen(false)
                      setZoneOpen(false)
                      setFocus(''); // clear focus when toggling parent
                    }}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-gradient-to-r from-sky-300 to-purple-300 transition
                    ${
                      serviceOpen && !focus.startsWith('/dashboard/service/')
                        ? 'bg-gradient-to-r from-purple-300 to-sky-300 text-white shadow-3xl'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      serviceOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )
                    )}
                  </button>

                  {/* Submenu */}
                  {serviceOpen && !isCollapsed && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {serviceSubItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => {
                            setFocus(sub.href);
                          }}
                          className={`block text-slate-700 hover:text-white hover:bg-gradient-to-r from-sky-300 to-purple-300 p-1.5 rounded-md transition 
                          ${
                            focus === sub.href
                              ? 'bg-gradient-to-r from-purple-300 to-sky-300 text-white shadow-3xl'
                              : ''
                          }`}
                        >
                          <sub.icon className="inline-block mr-2" />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else if (item.label === 'zonesDesservies') {
              return (
                <div key={item.label}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isCollapsed) setIsCollapsed(false);
                      setZoneOpen(!zoneOpen);
                      setServiceOpen(false)
                      setAnimationsOpen(false);
                      setAnimationSetOpen(false)
                      setFocus(''); // clear focus when toggling parent
                    }}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-gradient-to-r from-sky-300 to-purple-300 transition
                    ${
                      zoneOpen && !focus.startsWith('/dashboard/zoneDesservies/')
                        ? 'bg-gradient-to-r from-purple-300 to-sky-300 text-white shadow-3xl'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      zoneOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )
                    )}
                  </button>

                  {/* Submenu */}
                  {zoneOpen && !isCollapsed && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {zoneSubItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => {
                            setFocus(sub.href);
                          }}
                          className={`block text-slate-700 hover:text-white hover:bg-gradient-to-r from-sky-300 to-purple-300 p-1.5 rounded-md transition 
                          ${
                            focus === sub.href
                              ? 'bg-gradient-to-r from-purple-300 to-sky-300 text-white shadow-3xl'
                              : ''
                          }`}
                        >
                          <sub.icon className="inline-block mr-2" />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block"
                  onClick={() => {
                    setFocus(item.href);
                    setAnimationsOpen(false);
                    setAnimationSetOpen(false);
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div
                    className={`flex items-center gap-4 p-1.5 rounded-lg hover:bg-gradient-to-r from-sky-300 to-purple-300 transition
                    ${
                      focus === item.href
                        ? 'bg-gradient-to-r from-purple-300 to-sky-300 text-white shadow-3xl'
                        : ''
                    }`}
                  >
                    <IconComponent />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            }
          })}
        </div>
      </nav>

      {/* Signed In */}
      <SignedIn>
        {!isCollapsed ? (
          <div className="p-3">
            <div className="flex items-center space-x-3 rounded-lg">
              <UserButton
                appearance={{
                  elements: { avatarBox: 'w-10 h-10' },
                }}
              />
              <div className="flex-1">
                <p className="text-base font-medium">Salut encore !</p>
                <p className="text-sm text-slate-400">Gérez votre compte</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 flex justify-center">
            <UserButton
              appearance={{
                elements: { avatarBox: 'w-8 h-8' },
              }}
            />
          </div>
        )}
      </SignedIn>

      {/* Signed Out */}
      <SignedOut>
        <div className="mt-4">
          {!isCollapsed ? (
            <div className="space-y-3">
              <SignInButton>
                <button className="w-full flex items-center justify-center space-x-2 border border-blue-500 text-blue-400 font-semibold px-4 py-3 rounded-lg hover:bg-blue-500 hover:text-white transition">
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow hover:shadow-xl">
                  <User className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </SignUpButton>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 items-center">
              <SignInButton>
                <button
                  className="p-2 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition"
                  title="Sign In"
                >
                  <User className="w-4 h-4" />
                </button>
              </SignInButton>
              <SignUpButton>
                <button
                  className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
                  title="Sign Up"
                >
                  <User className="w-4 h-4" />
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </SignedOut>
    </div>
  );
}
