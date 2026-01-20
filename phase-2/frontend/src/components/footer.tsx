'use client';

import Link from 'next/link';
import { CheckSquare, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/40">
      <div className="container py-12 md:py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Simplify your life with our intuitive task management solution. Stay organized, boost productivity.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-200 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/features" 
                  className="text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-200 inline-block"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/tasks" 
                  className="text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-200 inline-block"
                >
                  Tasks
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-200 inline-block"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-200 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-200 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-200 inline-block"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-orange-500 transition-colors duration-200 inline-block"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Connect
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Follow us on social media for updates and tips.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-orange-500 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-orange-500 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-orange-500 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-orange-500 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} TaskFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-orange-500 fill-orange-500" />
              <span>for productivity</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;