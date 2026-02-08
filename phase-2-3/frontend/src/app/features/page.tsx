'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  ListTodo,
  Zap,
  Shield,
  Bell,
  Calendar,
  Filter,
  BarChart3,
  Cloud,
  Smartphone,
  Lock,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      icon: ListTodo,
      title: "Smart Task Management",
      description: "Create, organize, and prioritize your tasks with an intuitive interface. Add descriptions, set deadlines, and track progress effortlessly.",
      color: "text-orange-600"
    },
    {
      icon: CheckCircle2,
      title: "Quick Task Completion",
      description: "Mark tasks as complete with a single click. Track your productivity and see your accomplishments grow.",
      color: "text-green-600"
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description: "Filter tasks by status, priority, or date. Find exactly what you need when you need it.",
      color: "text-blue-600"
    },
    {
      icon: Calendar,
      title: "Due Date Tracking",
      description: "Set deadlines for your tasks and never miss an important date. Get organized and stay on schedule.",
      color: "text-purple-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Built with Next.js 16 and React 19 for blazing fast page loads and smooth interactions.",
      color: "text-yellow-600"
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Your data is protected with industry-standard JWT authentication and encryption.",
      color: "text-red-600"
    },
    {
      icon: Cloud,
      title: "Cloud Synchronization",
      description: "Access your tasks from anywhere. Your data is securely stored in the cloud.",
      color: "text-cyan-600"
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Works perfectly on desktop, tablet, and mobile. Manage tasks on any device.",
      color: "text-pink-600"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your tasks are private and secure. We never share your data with third parties.",
      color: "text-indigo-600"
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Visualize your productivity with stats and insights about your task completion.",
      color: "text-teal-600"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get notified about upcoming deadlines and important task updates.",
      color: "text-amber-600"
    },
    {
      icon: Users,
      title: "User-Friendly Interface",
      description: "Clean, modern design that makes task management a pleasure, not a chore.",
      color: "text-emerald-600"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <Badge variant="secondary" className="mb-4 text-sm">
          ✨ Powerful Features
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight">
          Everything You Need to{' '}
          <span className="text-orange-500">Stay Organized</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          TaskFlow comes packed with powerful features designed to make task management
          simple, efficient, and enjoyable. Discover what makes us different.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-orange-500/50"
            >
              <CardHeader>
                <div className="mb-4">
                  <div className="inline-flex p-3 rounded-lg bg-orange-100/50">
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Experience These Features?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of productive users who trust TaskFlow to manage their daily tasks
              and achieve their goals.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Built with Modern Technology</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          <Badge variant="secondary" className="text-sm py-2 px-4">Next.js 16</Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4">React 19</Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4">TypeScript</Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4">Tailwind CSS</Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4">shadcn/ui</Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4">PostgreSQL</Badge>
          <Badge variant="secondary" className="text-sm py-2 px-4">Better-Auth</Badge>
        </div>
      </div>
    </div>
  );
}