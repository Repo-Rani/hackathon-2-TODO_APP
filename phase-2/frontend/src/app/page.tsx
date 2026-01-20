'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { CheckCircle, Brain, Bell, RefreshCw, Play, ArrowRight, Clock, Sparkles, Star, Calendar, Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-orange-50 dark:from-background dark:to-orange-950">

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 mb-6"
          >
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              ✨ Now with AI Assistant
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            Your Tasks,{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Organized.
            </span>{' '}
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl">Effortlessly.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Supercharge your productivity with AI-powered task management. Simple, beautiful, and blazingly fast.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <Card className="p-6 bg-gradient-to-br from-white/80 to-orange-50/80 dark:from-gray-900/80 dark:to-gray-950/80 backdrop-blur-sm border border-orange-200/50 dark:border-orange-900/50 shadow-2xl">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">In Progress</span>
                    </div>
                    <h3 className="font-semibold">Project Alpha</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2 of 5 tasks completed</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">Planning</span>
                    </div>
                    <h3 className="font-semibold">Marketing Campaign</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">5 tasks planned</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm font-medium">Review</span>
                    </div>
                    <h3 className="font-semibold">Website Redesign</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ready for review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Features that make you productive</h2>
            <p className="text-xl text-muted-foreground">Everything you need to stay organized and focused</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-center">AI-Powered Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Let AI help you prioritize, categorize, and manage your tasks intelligently.
                  </CardDescription>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button variant="link" className="text-orange-500">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-center">Smart Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Never miss a deadline with intelligent notifications and recurring task automation.
                  </CardDescription>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button variant="link" className="text-orange-500">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 hover:-translate-y-2 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="h-8 w-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-center">Real-Time Sync</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Access your tasks anywhere, anytime. Seamless sync across all your devices.
                  </CardDescription>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button variant="link" className="text-orange-500">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in three simple steps</p>
          </div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="flex flex-col items-center mr-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">1</div>
                <div className="h-16 w-0.5 bg-orange-200 dark:bg-orange-800 mt-2"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Sign Up</h3>
                <p className="text-lg text-muted-foreground">Create your free account in seconds</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="flex flex-col items-center mr-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">2</div>
                <div className="h-16 w-0.5 bg-orange-200 dark:bg-orange-800 mt-2"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Add Tasks</h3>
                <p className="text-lg text-muted-foreground">Organize your work with smart lists</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="flex flex-col items-center mr-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">3</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Stay Productive</h3>
                <p className="text-lg text-muted-foreground">Let AI help you focus on what matters</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by thousands of users</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-lg italic mb-4">&ldquo;Amazing app! It has completely transformed how I manage my day.&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Sarah Johnson" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Product Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-lg italic mb-4">&ldquo;This app has increased my productivity by 200%. I can&rsquo;t imagine working without it now.&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Michael Chen" />
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Michael Chen</p>
                      <p className="text-sm text-muted-foreground">Software Engineer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-lg italic mb-4">&ldquo;The simplicity and elegance of this app is unmatched. It just works.&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder-avatar.jpg" alt="Emma Rodriguez" />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Emma Rodriguez</p>
                      <p className="text-sm text-muted-foreground">Marketing Director</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get organized?</h2>
          <p className="text-xl text-orange-100 mb-8">Join thousands of users today</p>
          <Button size="lg" className="bg-white text-orange-500 hover:bg-white/90 text-lg px-8 py-6">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
