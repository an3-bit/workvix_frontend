
import React from 'react';
import { Search, Star, Heart, Play, Bookmark, DollarSign, TrendingUp, Calendar, Users, Briefcase, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';

const FreelancerDashboard = () => {
  const navigate = useNavigate();

  const recommendedJobs = [
    {
      id: 1,
      title: "Build a responsive WordPress website",
      client: "TechStart Inc",
      budget: "$500-$1000",
      timePosted: "2 hours ago",
      description: "Looking for an experienced WordPress developer to build a responsive business website...",
      skills: ["WordPress", "PHP", "CSS", "JavaScript"],
      proposals: 12
    },
    {
      id: 2,
      title: "Logo design for startup company",
      client: "CreativeCorp",
      budget: "$100-$300",
      timePosted: "4 hours ago",
      description: "Need a modern, professional logo for our tech startup. Must be scalable and work across platforms...",
      skills: ["Logo Design", "Adobe Illustrator", "Branding"],
      proposals: 8
    },
    {
      id: 3,
      title: "Data entry and Excel automation",
      client: "DataSolutions Ltd",
      budget: "$200-$400",
      timePosted: "6 hours ago",
      description: "Looking for someone to help with data entry and create automated Excel reports...",
      skills: ["Excel", "Data Entry", "VBA"],
      proposals: 15
    }
  ];

  const quickActions = [
    { 
      icon: <Search className="h-6 w-6" />, 
      title: "Browse Jobs", 
      desc: "Find new opportunities",
      link: "/jobs"
    },
    { 
      icon: <Users className="h-6 w-6" />, 
      title: "My Proposals", 
      desc: "Track your bids",
      link: "/bids"
    },
    { 
      icon: <DollarSign className="h-6 w-6" />, 
      title: "Earnings", 
      desc: "View your income",
      link: "/freelancer/earnings"
    },
    { 
      icon: <Briefcase className="h-6 w-6" />, 
      title: "Portfolio", 
      desc: "Showcase your work",
      link: "/freelancer/portfolio"
    }
  ];

  const statsData = {
    totalEarnings: 2847.50,
    activeProposals: 6,
    completedJobs: 23,
    clientRating: 4.8
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20 z-0"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="flex flex-col lg:flex-row items-start justify-between">
              <div className="max-w-2xl mb-8">
                <h2 className="text-4xl font-bold mb-4">Welcome back, Freelancer!</h2>
                <p className="text-lg opacity-90 mb-6">
                  Ready to take on new challenges? Browse the latest opportunities and grow your business.
                </p>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">${statsData.totalEarnings}</p>
                        <p className="text-sm opacity-80">Total Earned</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{statsData.activeProposals}</p>
                        <p className="text-sm opacity-80">Active Bids</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{statsData.completedJobs}</p>
                        <p className="text-sm opacity-80">Completed</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{statsData.clientRating}</p>
                        <p className="text-sm opacity-80">Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="self-start">
                <Link to="/jobs">
                  <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-md">
                    Browse Jobs →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.link}>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <span className="text-blue-600">{action.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Jobs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs for You</h2>
              <Link to="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">
                View All Jobs →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {job.title}
                    </h3>
                    <button className="text-gray-400 hover:text-red-500">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-green-600">{job.budget}</span>
                    <span className="text-sm text-gray-500">{job.timePosted}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{job.proposals} proposals</span>
                    <Link to={`/jobs/${job.id}/bids`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Submit Proposal
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity & Notifications */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Proposal accepted for "Logo Design"</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">New message from TechStart Inc</p>
                      <p className="text-sm text-gray-600">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Payment received - $150</p>
                      <p className="text-sm text-gray-600">1 day ago</p>
                    </div>
                  </div>
                </div>
                <Link to="/freelancer/notifications" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block">
                  View all notifications →
                </Link>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link to="/freelancer/portfolio" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Manage Portfolio</span>
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link to="/freelancer/earnings" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">View Earnings</span>
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link to="/profile" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Update Profile</span>
                    <Users className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link to="/upgrade" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Upgrade to Pro</span>
                    <Star className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
