'use client';

import { motion } from 'framer-motion';
import { Users, Building2,  Plus, Edit3, Rss } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default  function DashboardPage() {
    const [blogData, setBlogData] = useState<{totalBlogs:number,totalViews:number}|null>({
        totalBlogs: 0,
        totalViews: 0
    });
    const [centerData, setCenterData] = useState<number>();
    const fetchStats = async () => {
        try {
            const response = await fetch('/api/v1/stats',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                console.error('Failed to fetch stats:', response?.statusText);
                
            }
            const data = await response.json();
            setBlogData(data.blogs);
            setCenterData(data.centers);
            console.log('Fetched stats:', data);
        } catch (error:unknown) {
            console.error('Error fetching stats:', error);
        }
    }
    
    useEffect(()=>{
        fetchStats();
    },[])
  const stats = [
    { icon: Rss, label: 'Nombre des articles', value: `${blogData?.totalBlogs}`, color: 'from-blue-500 to-blue-600' },
    { icon: Building2, label: 'Centres', value: `${centerData}`, color: 'from-green-500 to-green-600' },
    { icon: Users, label: 'Nombre de Vues Articles', value: `${blogData?.totalViews}`, color: 'from-purple-500 to-purple-600' },
    
  ];

  const quickActions = [
    {
      title: 'Create New Blog',
      description: 'Write and publish a new blog post',
      href: '/dashboard/blog/createBlog',
      icon: Plus,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Manage Blogs',
      description: 'Edit or delete existing blog posts',
      href: '/dashboard/blog/editBlog',
      icon: Edit3,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Manage Centers',
      description: 'Add or update service centers',
      href: '/dashboard/center',
      icon: Building2,
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your content.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-200/60 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-200/60 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600">{action.description}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200/60 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Created new blog post', title: 'Impact des Pneus sur la Consommation', time: '2 hours ago' },
              { action: 'Updated center information', title: 'Paris République Center', time: '5 hours ago' },
              { action: 'Published blog post', title: 'Nouveautés du Contrôle Technique 2024', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.action}</p>
                  <p className="text-gray-600 text-sm">{activity.title}</p>
                </div>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </div>
  );
}