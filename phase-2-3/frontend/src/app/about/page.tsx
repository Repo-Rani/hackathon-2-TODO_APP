'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Star, Users, Zap, Globe } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Streamlined interface for maximum productivity and efficiency."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Task Management",
      description: "Organize and track your tasks with ease and precision."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Cross-Platform",
      description: "Access your tasks from any device, anywhere."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaboration",
      description: "Share tasks and collaborate with your team seamlessly."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      content: "This app has completely transformed how I manage my daily tasks. Highly recommended!"
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content: "Increased my productivity by 200%. I can't imagine working without it now."
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Director",
      content: "The simplicity and elegance of this app is unmatched. It just works."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-orange-50 dark:from-background dark:to-orange-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">About Our Mission</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Empowering Productivity, One Task at a Time
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We believe that everyone deserves a simple, elegant solution to manage their tasks and boost productivity.
          </p>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Todo App</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-muted-foreground">Support</div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{testimonial.content}</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary to-primary/80 dark:from-primary/90 dark:to-primary/40">
  <CardContent className="p-8 text-primary-foreground">
    <h2 className="text-3xl font-bold mb-4">
      Ready to Boost Your Productivity?
    </h2>

    <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
      Join thousands of users who have transformed their workflow with our simple yet powerful task management solution.
    </p>

    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <a href="/signup">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-md font-medium
                     dark:bg-primary-foreground dark:text-primary dark:hover:bg-primary-foreground/90"
        >
          Get Started Free
        </motion.button>
      </a>

      <a href="/signin">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border-2 border-white text-white hover:bg-white/10 px-6 py-2 rounded-md font-medium
                     dark:border-primary-foreground dark:text-primary-foreground dark:hover:bg-primary-foreground/10"
        >
          Sign In
        </motion.button>
      </a>
    </div>
  </CardContent>
</Card>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;