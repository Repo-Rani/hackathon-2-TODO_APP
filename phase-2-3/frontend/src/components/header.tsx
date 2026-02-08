'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, X, User, Home, Settings, LogOut, CheckSquare, ListTodo } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const pathname = usePathname(); // ✅ NEW: Current route ko track karne ke liye

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);

      // Get user info if logged in
      if (token) {
        // You can decode JWT token or get from API
        // For now using email from localStorage if available
        const email = localStorage.getItem('user_email') || '';
        const name = localStorage.getItem('user_name') || email.split('@')[0] || 'User';

        setUserEmail(email);
        setUserName(name);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);

    // ✅ NEW: Listen for custom authChange event
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');

    // Clear cookie
    document.cookie = 'access_token=; path=/; max-age=0';

    // Update state
    setIsAuthenticated(false);

    // ✅ NEW: Dispatch event to update navbar immediately
    window.dispatchEvent(new Event('authChange'));

    // Show success message
    toast.success('Logged out successfully!');

    // Redirect to signin page
    router.push('/signin');
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Features', href: '/features', icon: CheckSquare },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'About', href: '/about', icon: Settings },
  ];

  // ✅ NEW: Check if route is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/home';
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={isAuthenticated ? "/home" : "/"} className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Navigation - Only show if authenticated */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors hover:text-orange-500 flex items-center gap-2 relative pb-1 ${
                    isActive(item.href) ? 'text-orange-500' : ''
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {/* ✅ NEW: Active indicator line */}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>
                  )}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                {/* Auth buttons for unauthenticated users */}
                <Link href="/signin">
                  <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* User profile dropdown for authenticated users */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-orange-500">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={userName} />
                        <AvatarFallback className="bg-orange-500 text-white font-semibold">
                          {getUserInitials(userName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/home">
                      <DropdownMenuItem className="cursor-pointer">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/tasks">
                      <DropdownMenuItem className="cursor-pointer">
                        <CheckSquare className="mr-2 h-4 w-4" />
                        <span>My Tasks</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/chat">
                      <DropdownMenuItem className="cursor-pointer">
                        <ListTodo className="mr-2 h-4 w-4" />
                        <span>AI Chat</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-100">
              <div className="flex flex-col h-full">
                {/* Mobile Navigation */}
                {isAuthenticated && (
                  <div className="flex flex-col space-y-4 mt-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`text-lg font-medium py-2 hover:text-orange-500 flex items-center gap-3 relative ${
                          isActive(item.href) ? 'text-orange-500' : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                        {/* ✅ NEW: Active indicator line for mobile */}
                        {isActive(item.href) && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r"></span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="pt-4 mt-auto">
                  {!isAuthenticated ? (
                    <>
                      {/* Auth buttons for mobile unauthenticated users */}
                      <div className="flex flex-col gap-2 pb-4">
                        <Link href="/signin" className="w-full">
                          <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/signup" className="w-full">
                          <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* User profile for mobile authenticated users */}
                      <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={userName} />
                          <AvatarFallback className="bg-orange-500 text-white font-semibold text-lg">
                            {getUserInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{userName}</p>
                          <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                        </div>
                      </div>

                      <div className="pt-2 space-y-1">
                        <Link href="/home" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link href="/tasks" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <CheckSquare className="mr-2 h-4 w-4" />
                            My Tasks
                          </Button>
                        </Link>
                        <Link href="/chat" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <ListTodo className="mr-2 h-4 w-4" />
                            AI Chat
                          </Button>
                        </Link>
                        <Button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;