import React, { useState } from 'react';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const projects = [
  // Logo Design (15)
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Modern Brand Identity",
    freelancer: "DesignStudio Pro",
    freelancerSlug: "designstudio-pro",
    rating: 4.9,
    reviews: 713,
    delivery: "2 days",
    price: "$150"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Minimalist Logo Pack",
    freelancer: "LogoCraft",
    freelancerSlug: "logocraft",
    rating: 4.8,
    reviews: 512,
    delivery: "3 days",
    price: "$120"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Vintage Logo Collection",
    freelancer: "RetroMark",
    freelancerSlug: "retromark",
    rating: 4.7,
    reviews: 389,
    delivery: "2 days",
    price: "$110"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Luxury Brand Logo",
    freelancer: "EliteDesigns",
    freelancerSlug: "elitedesigns",
    rating: 4.9,
    reviews: 210,
    delivery: "4 days",
    price: "$200"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Startup Logo Kit",
    freelancer: "StartUpArt",
    freelancerSlug: "startupart",
    rating: 4.8,
    reviews: 156,
    delivery: "2 days",
    price: "$130"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Hand-drawn Logo Set",
    freelancer: "SketchyLines",
    freelancerSlug: "sketchylines",
    rating: 4.7,
    reviews: 98,
    delivery: "3 days",
    price: "$140"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Corporate Logo Design",
    freelancer: "BizLogo",
    freelancerSlug: "bizlogo",
    rating: 4.8,
    reviews: 134,
    delivery: "2 days",
    price: "$160"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Colorful Logo Concepts",
    freelancer: "ColorSplash",
    freelancerSlug: "colorsplash",
    rating: 4.9,
    reviews: 201,
    delivery: "3 days",
    price: "$170"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Monogram Logo Design",
    freelancer: "MonoMark",
    freelancerSlug: "monomark",
    rating: 4.8,
    reviews: 99,
    delivery: "2 days",
    price: "$125"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Geometric Logo Set",
    freelancer: "GeoDesigns",
    freelancerSlug: "geodesigns",
    rating: 4.7,
    reviews: 88,
    delivery: "3 days",
    price: "$135"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Mascot Logo Pack",
    freelancer: "MascotMakers",
    freelancerSlug: "mascotmakers",
    rating: 4.9,
    reviews: 77,
    delivery: "4 days",
    price: "$180"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Signature Logo Design",
    freelancer: "SignaArt",
    freelancerSlug: "signaart",
    rating: 4.8,
    reviews: 66,
    delivery: "2 days",
    price: "$145"
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Emblem Logo Collection",
    freelancer: "EmblemWorks",
    freelancerSlug: "emblemworks",
    rating: 4.7,
    reviews: 55,
    delivery: "3 days",
    price: "$155"
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Animated Logo Pack",
    freelancer: "Animotion",
    freelancerSlug: "animotion",
    rating: 4.8,
    reviews: 44,
    delivery: "2 days",
    price: "$165"
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Flat Logo Design",
    freelancer: "FlatArt",
    freelancerSlug: "flatart",
    rating: 4.9,
    reviews: 33,
    delivery: "3 days",
    price: "$175"
  },

  // Website Design (15)
  {
    id: 16,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "E-commerce Platform",
    freelancer: "WebCraft Solutions",
    freelancerSlug: "webcraft-solutions",
    rating: 4.8,
    reviews: 512,
    delivery: "5 days",
    price: "$500"
  },
  {
    id: 17,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Fitness Tracking App",
    freelancer: "AppDev Masters",
    freelancerSlug: "appdev-masters",
    rating: 4.9,
    reviews: 389,
    delivery: "7 days",
    price: "$800"
  },
  {
    id: 18,
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Marketing Campaign",
    freelancer: "Creative Studio",
    freelancerSlug: "creative-studio",
    rating: 4.7,
    reviews: 210,
    delivery: "3 days",
    price: "$200"
  },
  {
    id: 19,
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Product Launch Video",
    freelancer: "VideoPro",
    freelancerSlug: "videopro",
    rating: 4.8,
    reviews: 156,
    delivery: "4 days",
    price: "$300"
  },
  {
    id: 20,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Architectural Visualization",
    freelancer: "3D Vision",
    freelancerSlug: "3d-vision",
    rating: 4.9,
    reviews: 98,
    delivery: "6 days",
    price: "$600"
  },
  {
    id: 21,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Children's Book Art",
    freelancer: "Artistic Dreams",
    freelancerSlug: "artistic-dreams",
    rating: 4.8,
    reviews: 134,
    delivery: "3 days",
    price: "$250"
  },
  {
    id: 22,
    image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Corporate Identity",
    freelancer: "Brand Masters",
    freelancerSlug: "brand-masters",
    rating: 4.9,
    reviews: 201,
    delivery: "2 days",
    price: "$400"
  },
  {
    id: 23,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Minimalist Logo Pack",
    freelancer: "LogoCraft",
    freelancerSlug: "logocraft",
    rating: 4.8,
    reviews: 512,
    delivery: "3 days",
    price: "$120"
  },
  {
    id: 24,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Vintage Logo Collection",
    freelancer: "RetroMark",
    freelancerSlug: "retromark",
    rating: 4.7,
    reviews: 389,
    delivery: "2 days",
    price: "$110"
  },
  {
    id: 25,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Luxury Brand Logo",
    freelancer: "EliteDesigns",
    freelancerSlug: "elitedesigns",
    rating: 4.9,
    reviews: 210,
    delivery: "4 days",
    price: "$200"
  },
  {
    id: 26,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Startup Logo Kit",
    freelancer: "StartUpArt",
    freelancerSlug: "startupart",
    rating: 4.8,
    reviews: 156,
    delivery: "2 days",
    price: "$130"
  },
  {
    id: 27,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Hand-drawn Logo Set",
    freelancer: "SketchyLines",
    freelancerSlug: "sketchylines",
    rating: 4.7,
    reviews: 98,
    delivery: "3 days",
    price: "$140"
  },
  {
    id: 28,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Corporate Logo Design",
    freelancer: "BizLogo",
    freelancerSlug: "bizlogo",
    rating: 4.8,
    reviews: 134,
    delivery: "2 days",
    price: "$160"
  },
  {
    id: 29,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Colorful Logo Concepts",
    freelancer: "ColorSplash",
    freelancerSlug: "colorsplash",
    rating: 4.9,
    reviews: 201,
    delivery: "3 days",
    price: "$170"
  },
  {
    id: 30,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Monogram Logo Design",
    freelancer: "MonoMark",
    freelancerSlug: "monomark",
    rating: 4.8,
    reviews: 99,
    delivery: "2 days",
    price: "$125"
  },
  {
    id: 31,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Geometric Logo Set",
    freelancer: "GeoDesigns",
    freelancerSlug: "geodesigns",
    rating: 4.7,
    reviews: 88,
    delivery: "3 days",
    price: "$135"
  },
  {
    id: 32,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Mascot Logo Pack",
    freelancer: "MascotMakers",
    freelancerSlug: "mascotmakers",
    rating: 4.9,
    reviews: 77,
    delivery: "4 days",
    price: "$180"
  },
  {
    id: 33,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Signature Logo Design",
    freelancer: "SignaArt",
    freelancerSlug: "signaart",
    rating: 4.8,
    reviews: 66,
    delivery: "2 days",
    price: "$145"
  },
  {
    id: 34,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Emblem Logo Collection",
    freelancer: "EmblemWorks",
    freelancerSlug: "emblemworks",
    rating: 4.7,
    reviews: 55,
    delivery: "3 days",
    price: "$155"
  },
  {
    id: 35,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Animated Logo Pack",
    freelancer: "Animotion",
    freelancerSlug: "animotion",
    rating: 4.8,
    reviews: 44,
    delivery: "2 days",
    price: "$165"
  },
  {
    id: 36,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "Flat Logo Design",
    freelancer: "FlatArt",
    freelancerSlug: "flatart",
    rating: 4.9,
    reviews: 33,
    delivery: "3 days",
    price: "$175"
  },

  // Mobile App (15)
  {
    id: 37,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Fitness Tracking App",
    freelancer: "AppDev Masters",
    freelancerSlug: "appdev-masters",
    rating: 4.9,
    reviews: 389,
    delivery: "7 days",
    price: "$800"
  },
  {
    id: 38,
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Marketing Campaign",
    freelancer: "Creative Studio",
    freelancerSlug: "creative-studio",
    rating: 4.7,
    reviews: 210,
    delivery: "3 days",
    price: "$200"
  },
  {
    id: 39,
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Product Launch Video",
    freelancer: "VideoPro",
    freelancerSlug: "videopro",
    rating: 4.8,
    reviews: 156,
    delivery: "4 days",
    price: "$300"
  },
  {
    id: 40,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Architectural Visualization",
    freelancer: "3D Vision",
    freelancerSlug: "3d-vision",
    rating: 4.9,
    reviews: 98,
    delivery: "6 days",
    price: "$600"
  },
  {
    id: 41,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Children's Book Art",
    freelancer: "Artistic Dreams",
    freelancerSlug: "artistic-dreams",
    rating: 4.8,
    reviews: 134,
    delivery: "3 days",
    price: "$250"
  },
  {
    id: 42,
    image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Corporate Identity",
    freelancer: "Brand Masters",
    freelancerSlug: "brand-masters",
    rating: 4.9,
    reviews: 201,
    delivery: "2 days",
    price: "$400"
  },
  {
    id: 43,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Minimalist Logo Pack",
    freelancer: "LogoCraft",
    freelancerSlug: "logocraft",
    rating: 4.8,
    reviews: 512,
    delivery: "3 days",
    price: "$120"
  },
  {
    id: 44,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Vintage Logo Collection",
    freelancer: "RetroMark",
    freelancerSlug: "retromark",
    rating: 4.7,
    reviews: 389,
    delivery: "2 days",
    price: "$110"
  },
  {
    id: 45,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Luxury Brand Logo",
    freelancer: "EliteDesigns",
    freelancerSlug: "elitedesigns",
    rating: 4.9,
    reviews: 210,
    delivery: "4 days",
    price: "$200"
  },
  {
    id: 46,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Startup Logo Kit",
    freelancer: "StartUpArt",
    freelancerSlug: "startupart",
    rating: 4.8,
    reviews: 156,
    delivery: "2 days",
    price: "$130"
  },
  {
    id: 47,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Hand-drawn Logo Set",
    freelancer: "SketchyLines",
    freelancerSlug: "sketchylines",
    rating: 4.7,
    reviews: 98,
    delivery: "3 days",
    price: "$140"
  },
  {
    id: 48,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Corporate Logo Design",
    freelancer: "BizLogo",
    freelancerSlug: "bizlogo",
    rating: 4.8,
    reviews: 134,
    delivery: "2 days",
    price: "$160"
  },
  {
    id: 49,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Colorful Logo Concepts",
    freelancer: "ColorSplash",
    freelancerSlug: "colorsplash",
    rating: 4.9,
    reviews: 201,
    delivery: "3 days",
    price: "$170"
  },
  {
    id: 50,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Monogram Logo Design",
    freelancer: "MonoMark",
    freelancerSlug: "monomark",
    rating: 4.8,
    reviews: 99,
    delivery: "2 days",
    price: "$125"
  },
  {
    id: 51,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Geometric Logo Set",
    freelancer: "GeoDesigns",
    freelancerSlug: "geodesigns",
    rating: 4.7,
    reviews: 88,
    delivery: "3 days",
    price: "$135"
  },
  {
    id: 52,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Mascot Logo Pack",
    freelancer: "MascotMakers",
    freelancerSlug: "mascotmakers",
    rating: 4.9,
    reviews: 77,
    delivery: "4 days",
    price: "$180"
  },
  {
    id: 53,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Signature Logo Design",
    freelancer: "SignaArt",
    freelancerSlug: "signaart",
    rating: 4.8,
    reviews: 66,
    delivery: "2 days",
    price: "$145"
  },
  {
    id: 54,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Emblem Logo Collection",
    freelancer: "EmblemWorks",
    freelancerSlug: "emblemworks",
    rating: 4.7,
    reviews: 55,
    delivery: "3 days",
    price: "$155"
  },
  {
    id: 55,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Animated Logo Pack",
    freelancer: "Animotion",
    freelancerSlug: "animotion",
    rating: 4.8,
    reviews: 44,
    delivery: "2 days",
    price: "$165"
  },
  {
    id: 56,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Flat Logo Design",
    freelancer: "FlatArt",
    freelancerSlug: "flatart",
    rating: 4.9,
    reviews: 33,
    delivery: "3 days",
    price: "$175"
  },

  // Graphic Design (15)
  {
    id: 57,
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Marketing Campaign",
    freelancer: "Creative Studio",
    freelancerSlug: "creative-studio",
    rating: 4.7,
    reviews: 210,
    delivery: "3 days",
    price: "$200"
  },
  {
    id: 58,
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Product Launch Video",
    freelancer: "VideoPro",
    freelancerSlug: "videopro",
    rating: 4.8,
    reviews: 156,
    delivery: "4 days",
    price: "$300"
  },
  {
    id: 59,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Architectural Visualization",
    freelancer: "3D Vision",
    freelancerSlug: "3d-vision",
    rating: 4.9,
    reviews: 98,
    delivery: "6 days",
    price: "$600"
  },
  {
    id: 60,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Children's Book Art",
    freelancer: "Artistic Dreams",
    freelancerSlug: "artistic-dreams",
    rating: 4.8,
    reviews: 134,
    delivery: "3 days",
    price: "$250"
  },
  {
    id: 61,
    image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Corporate Identity",
    freelancer: "Brand Masters",
    freelancerSlug: "brand-masters",
    rating: 4.9,
    reviews: 201,
    delivery: "2 days",
    price: "$400"
  },
  {
    id: 62,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Minimalist Logo Pack",
    freelancer: "LogoCraft",
    freelancerSlug: "logocraft",
    rating: 4.8,
    reviews: 512,
    delivery: "3 days",
    price: "$120"
  },
  {
    id: 63,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Vintage Logo Collection",
    freelancer: "RetroMark",
    freelancerSlug: "retromark",
    rating: 4.7,
    reviews: 389,
    delivery: "2 days",
    price: "$110"
  },
  {
    id: 64,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Luxury Brand Logo",
    freelancer: "EliteDesigns",
    freelancerSlug: "elitedesigns",
    rating: 4.9,
    reviews: 210,
    delivery: "4 days",
    price: "$200"
  },
  {
    id: 65,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Startup Logo Kit",
    freelancer: "StartUpArt",
    freelancerSlug: "startupart",
    rating: 4.8,
    reviews: 156,
    delivery: "2 days",
    price: "$130"
  },
  {
    id: 66,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Hand-drawn Logo Set",
    freelancer: "SketchyLines",
    freelancerSlug: "sketchylines",
    rating: 4.7,
    reviews: 98,
    delivery: "3 days",
    price: "$140"
  },
  {
    id: 67,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Corporate Logo Design",
    freelancer: "BizLogo",
    freelancerSlug: "bizlogo",
    rating: 4.8,
    reviews: 134,
    delivery: "2 days",
    price: "$160"
  },
  {
    id: 68,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Colorful Logo Concepts",
    freelancer: "ColorSplash",
    freelancerSlug: "colorsplash",
    rating: 4.9,
    reviews: 201,
    delivery: "3 days",
    price: "$170"
  },
  {
    id: 69,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Monogram Logo Design",
    freelancer: "MonoMark",
    freelancerSlug: "monomark",
    rating: 4.8,
    reviews: 99,
    delivery: "2 days",
    price: "$125"
  },
  {
    id: 70,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Geometric Logo Set",
    freelancer: "GeoDesigns",
    freelancerSlug: "geodesigns",
    rating: 4.7,
    reviews: 88,
    delivery: "3 days",
    price: "$135"
  },
  {
    id: 71,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Mascot Logo Pack",
    freelancer: "MascotMakers",
    freelancerSlug: "mascotmakers",
    rating: 4.9,
    reviews: 77,
    delivery: "4 days",
    price: "$180"
  },
  {
    id: 72,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Signature Logo Design",
    freelancer: "SignaArt",
    freelancerSlug: "signaart",
    rating: 4.8,
    reviews: 66,
    delivery: "2 days",
    price: "$145"
  },
  {
    id: 73,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Emblem Logo Collection",
    freelancer: "EmblemWorks",
    freelancerSlug: "emblemworks",
    rating: 4.7,
    reviews: 55,
    delivery: "3 days",
    price: "$155"
  },
  {
    id: 74,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Animated Logo Pack",
    freelancer: "Animotion",
    freelancerSlug: "animotion",
    rating: 4.8,
    reviews: 44,
    delivery: "2 days",
    price: "$165"
  },
  {
    id: 75,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Flat Logo Design",
    freelancer: "FlatArt",
    freelancerSlug: "flatart",
    rating: 4.9,
    reviews: 33,
    delivery: "3 days",
    price: "$175"
  },

  // Video Editing (15)
  {
    id: 76,
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Product Launch Video",
    freelancer: "VideoPro",
    freelancerSlug: "videopro",
    rating: 4.8,
    reviews: 156,
    delivery: "4 days",
    price: "$300"
  },
  {
    id: 77,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Architectural Visualization",
    freelancer: "3D Vision",
    freelancerSlug: "3d-vision",
    rating: 4.9,
    reviews: 98,
    delivery: "6 days",
    price: "$600"
  },
  {
    id: 78,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Children's Book Art",
    freelancer: "Artistic Dreams",
    freelancerSlug: "artistic-dreams",
    rating: 4.8,
    reviews: 134,
    delivery: "3 days",
    price: "$250"
  },
  {
    id: 79,
    image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Corporate Identity",
    freelancer: "Brand Masters",
    freelancerSlug: "brand-masters",
    rating: 4.9,
    reviews: 201,
    delivery: "2 days",
    price: "$400"
  },
  {
    id: 80,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Minimalist Logo Pack",
    freelancer: "LogoCraft",
    freelancerSlug: "logocraft",
    rating: 4.8,
    reviews: 512,
    delivery: "3 days",
    price: "$120"
  },
  {
    id: 81,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Vintage Logo Collection",
    freelancer: "RetroMark",
    freelancerSlug: "retromark",
    rating: 4.7,
    reviews: 389,
    delivery: "2 days",
    price: "$110"
  },
  {
    id: 82,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Luxury Brand Logo",
    freelancer: "EliteDesigns",
    freelancerSlug: "elitedesigns",
    rating: 4.9,
    reviews: 210,
    delivery: "4 days",
    price: "$200"
  },
  {
    id: 83,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Startup Logo Kit",
    freelancer: "StartUpArt",
    freelancerSlug: "startupart",
    rating: 4.8,
    reviews: 156,
    delivery: "2 days",
    price: "$130"
  },
  {
    id: 84,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Hand-drawn Logo Set",
    freelancer: "SketchyLines",
    freelancerSlug: "sketchylines",
    rating: 4.7,
    reviews: 98,
    delivery: "3 days",
    price: "$140"
  },
  {
    id: 85,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Corporate Logo Design",
    freelancer: "BizLogo",
    freelancerSlug: "bizlogo",
    rating: 4.8,
    reviews: 134,
    delivery: "2 days",
    price: "$160"
  },
  {
    id: 86,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Colorful Logo Concepts",
    freelancer: "ColorSplash",
    freelancerSlug: "colorsplash",
    rating: 4.9,
    reviews: 201,
    delivery: "3 days",
    price: "$170"
  },
  {
    id: 87,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Monogram Logo Design",
    freelancer: "MonoMark",
    freelancerSlug: "monomark",
    rating: 4.8,
    reviews: 99,
    delivery: "2 days",
    price: "$125"
  },
  {
    id: 88,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Geometric Logo Set",
    freelancer: "GeoDesigns",
    freelancerSlug: "geodesigns",
    rating: 4.7,
    reviews: 88,
    delivery: "3 days",
    price: "$135"
  },
  {
    id: 89,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Mascot Logo Pack",
    freelancer: "MascotMakers",
    freelancerSlug: "mascotmakers",
    rating: 4.9,
    reviews: 77,
    delivery: "4 days",
    price: "$180"
  },
  {
    id: 90,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Signature Logo Design",
    freelancer: "SignaArt",
    freelancerSlug: "signaart",
    rating: 4.8,
    reviews: 66,
    delivery: "2 days",
    price: "$145"
  },
  {
    id: 91,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Emblem Logo Collection",
    freelancer: "EmblemWorks",
    freelancerSlug: "emblemworks",
    rating: 4.7,
    reviews: 55,
    delivery: "3 days",
    price: "$155"
  },
  {
    id: 92,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Animated Logo Pack",
    freelancer: "Animotion",
    freelancerSlug: "animotion",
    rating: 4.8,
    reviews: 44,
    delivery: "2 days",
    price: "$165"
  },
  {
    id: 93,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Flat Logo Design",
    freelancer: "FlatArt",
    freelancerSlug: "flatart",
    rating: 4.9,
    reviews: 33,
    delivery: "3 days",
    price: "$175"
  },

  // 3D Design (15)
  {
    id: 94,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Architectural Visualization",
    freelancer: "3D Vision",
    freelancerSlug: "3d-vision",
    rating: 4.9,
    reviews: 98,
    delivery: "6 days",
    price: "$600"
  },
  {
    id: 95,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Children's Book Art",
    freelancer: "Artistic Dreams",
    freelancerSlug: "artistic-dreams",
    rating: 4.8,
    reviews: 134,
    delivery: "3 days",
    price: "$250"
  },
  {
    id: 96,
    image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Corporate Identity",
    freelancer: "Brand Masters",
    freelancerSlug: "brand-masters",
    rating: 4.9,
    reviews: 201,
    delivery: "2 days",
    price: "$400"
  },
  {
    id: 97,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Minimalist Logo Pack",
    freelancer: "LogoCraft",
    freelancerSlug: "logocraft",
    rating: 4.8,
    reviews: 512,
    delivery: "3 days",
    price: "$120"
  },
  {
    id: 98,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Vintage Logo Collection",
    freelancer: "RetroMark",
    freelancerSlug: "retromark",
    rating: 4.7,
    reviews: 389,
    delivery: "2 days",
    price: "$110"
  },
  {
    id: 99,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Luxury Brand Logo",
    freelancer: "EliteDesigns",
    freelancerSlug: "elitedesigns",
    rating: 4.9,
    reviews: 210,
    delivery: "4 days",
    price: "$200"
  },
  {
    id: 100,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Startup Logo Kit",
    freelancer: "StartUpArt",
    freelancerSlug: "startupart",
    rating: 4.8,
    reviews: 156,
    delivery: "2 days",
    price: "$130"
  },
  {
    id: 101,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Hand-drawn Logo Set",
    freelancer: "SketchyLines",
    freelancerSlug: "sketchylines",
    rating: 4.7,
    reviews: 98,
    delivery: "3 days",
    price: "$140"
  },
  {
    id: 102,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Corporate Logo Design",
    freelancer: "BizLogo",
    freelancerSlug: "bizlogo",
    rating: 4.8,
    reviews: 134,
    delivery: "2 days",
    price: "$160"
  },
  {
    id: 103,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Colorful Logo Concepts",
    freelancer: "ColorSplash",
    freelancerSlug: "colorsplash",
    rating: 4.9,
    reviews: 201,
    delivery: "3 days",
    price: "$170"
  },
  {
    id: 104,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Monogram Logo Design",
    freelancer: "MonoMark",
    freelancerSlug: "monomark",
    rating: 4.8,
    reviews: 99,
    delivery: "2 days",
    price: "$125"
  },
  {
    id: 105,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Geometric Logo Set",
    freelancer: "GeoDesigns",
    freelancerSlug: "geodesigns",
    rating: 4.7,
    reviews: 88,
    delivery: "3 days",
    price: "$135"
  },
  {
    id: 106,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Mascot Logo Pack",
    freelancer: "MascotMakers",
    freelancerSlug: "mascotmakers",
    rating: 4.9,
    reviews: 77,
    delivery: "4 days",
    price: "$180"
  },
  {
    id: 107,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Signature Logo Design",
    freelancer: "SignaArt",
    freelancerSlug: "signaart",
    rating: 4.8,
    reviews: 66,
    delivery: "2 days",
    price: "$145"
  },
  {
    id: 108,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Emblem Logo Collection",
    freelancer: "EmblemWorks",
    freelancerSlug: "emblemworks",
    rating: 4.7,
    reviews: 55,
    delivery: "3 days",
    price: "$155"
  },
  {
    id: 109,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Animated Logo Pack",
    freelancer: "Animotion",
    freelancerSlug: "animotion",
    rating: 4.8,
    reviews: 44,
    delivery: "2 days",
    price: "$165"
  },
  {
    id: 110,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Flat Logo Design",
    freelancer: "FlatArt",
    freelancerSlug: "flatart",
    rating: 4.9,
    reviews: 33,
    delivery: "3 days",
    price: "$175"
  },

  // Illustration (15)
  {
    id: 111,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Modern Brand Identity",
    freelancer: "DesignStudio Pro",
    freelancerSlug: "designstudio-pro",
    rating: 4.9,
    reviews: 713,
    delivery: "2 days",
    price: "$150"
  },
  {
    id: 112,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "E-commerce Platform",
    freelancer: "WebCraft Solutions",
    freelancerSlug: "webcraft-solutions",
    rating: 4.8,
    reviews: 512,
    delivery: "5 days",
    price: "$500"
  },
  {
    id: 113,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Fitness Tracking App",
    freelancer: "AppDev Masters",
    freelancerSlug: "appdev-masters",
    rating: 4.9,
    reviews: 389,
    delivery: "7 days",
    price: "$800"
  },
  {
    id: 114,
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Marketing Campaign",
    freelancer: "Creative Studio",
    freelancerSlug: "creative-studio",
    rating: 4.7,
    reviews: 210,
    delivery: "3 days",
    price: "$200"
  },
  {
    id: 115,
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Product Launch Video",
    freelancer: "VideoPro",
    freelancerSlug: "videopro",
    rating: 4.8,
    reviews: 156,
    delivery: "4 days",
    price: "$300"
  },
  {
    id: 116,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Architectural Visualization",
    freelancer: "3D Vision",
    freelancerSlug: "3d-vision",
    rating: 4.9,
    reviews: 98,
    delivery: "6 days",
    price: "$600"
  },
  {
    id: 117,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Children's Book Art",
    freelancer: "Artistic Dreams",
    freelancerSlug: "artistic-dreams",
    rating: 4.8,
    reviews: 134,
    delivery: "3 days",
    price: "$250"
  },
  {
    id: 118,
    image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Corporate Identity",
    freelancer: "Brand Masters",
    freelancerSlug: "brand-masters",
    rating: 4.9,
    reviews: 201,
    delivery: "2 days",
    price: "$400"
  },
  {
    id: 119,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Minimalist Logo Pack",
    freelancer: "LogoCraft",
    freelancerSlug: "logocraft",
    rating: 4.8,
    reviews: 512,
    delivery: "3 days",
    price: "$120"
  },
  {
    id: 120,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Vintage Logo Collection",
    freelancer: "RetroMark",
    freelancerSlug: "retromark",
    rating: 4.7,
    reviews: 389,
    delivery: "2 days",
    price: "$110"
  },
  {
    id: 121,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Luxury Brand Logo",
    freelancer: "EliteDesigns",
    freelancerSlug: "elitedesigns",
    rating: 4.9,
    reviews: 210,
    delivery: "4 days",
    price: "$200"
  },
  {
    id: 122,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Startup Logo Kit",
    freelancer: "StartUpArt",
    freelancerSlug: "startupart",
    rating: 4.8,
    reviews: 156,
    delivery: "2 days",
    price: "$130"
  },
  {
    id: 123,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Hand-drawn Logo Set",
    freelancer: "SketchyLines",
    freelancerSlug: "sketchylines",
    rating: 4.7,
    reviews: 98,
    delivery: "3 days",
    price: "$140"
  },
  {
    id: 124,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Corporate Logo Design",
    freelancer: "BizLogo",
    freelancerSlug: "bizlogo",
    rating: 4.8,
    reviews: 134,
    delivery: "2 days",
    price: "$160"
  },
  {
    id: 125,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Colorful Logo Concepts",
    freelancer: "ColorSplash",
    freelancerSlug: "colorsplash",
    rating: 4.9,
    reviews: 201,
    delivery: "3 days",
    price: "$170"
  },
  {
    id: 126,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Monogram Logo Design",
    freelancer: "MonoMark",
    freelancerSlug: "monomark",
    rating: 4.8,
    reviews: 99,
    delivery: "2 days",
    price: "$125"
  },
  {
    id: 127,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Geometric Logo Set",
    freelancer: "GeoDesigns",
    freelancerSlug: "geodesigns",
    rating: 4.7,
    reviews: 88,
    delivery: "3 days",
    price: "$135"
  },
  {
    id: 128,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Mascot Logo Pack",
    freelancer: "MascotMakers",
    freelancerSlug: "mascotmakers",
    rating: 4.9,
    reviews: 77,
    delivery: "4 days",
    price: "$180"
  },
  {
    id: 129,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Signature Logo Design",
    freelancer: "SignaArt",
    freelancerSlug: "signaart",
    rating: 4.8,
    reviews: 66,
    delivery: "2 days",
    price: "$145"
  },
  {
    id: 130,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Emblem Logo Collection",
    freelancer: "EmblemWorks",
    freelancerSlug: "emblemworks",
    rating: 4.7,
    reviews: 55,
    delivery: "3 days",
    price: "$155"
  },
  {
    id: 131,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Animated Logo Pack",
    freelancer: "Animotion",
    freelancerSlug: "animotion",
    rating: 4.8,
    reviews: 44,
    delivery: "2 days",
    price: "$165"
  },
  {
    id: 132,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Flat Logo Design",
    freelancer: "FlatArt",
    freelancerSlug: "flatart",
    rating: 4.9,
    reviews: 33,
    delivery: "3 days",
    price: "$175"
  },

  // Branding (15)
  {
    id: 133,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Corporate Identity",
    freelancer: "Brand Masters",
    freelancerSlug: "brand-masters",
    rating: 4.9,
    reviews: 201,
    delivery: "2 days",
    price: "$400"
  },
  {
    id: 134,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "E-commerce Platform",
    freelancer: "WebCraft Solutions",
    freelancerSlug: "webcraft-solutions",
    rating: 4.8,
    reviews: 512,
    delivery: "5 days",
    price: "$500"
  },
  {
    id: 135,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Fitness Tracking App",
    freelancer: "AppDev Masters",
    freelancerSlug: "appdev-masters",
    rating: 4.9,
    reviews: 389,
    delivery: "7 days",
    price: "$800"
  },
  {
    id: 136,
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Marketing Campaign",
    freelancer: "Creative Studio",
    freelancerSlug: "creative-studio",
    rating: 4.7,
    reviews: 210,
    delivery: "3 days",
    price: "$200"
  },
  {
    id: 137,
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Product Launch Video",
    freelancer: "VideoPro",
    freelancerSlug: "videopro",
    rating: 4.8,
    reviews: 156,
    delivery: "4 days",
    price: "$300"
  },
  {
    id: 138,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Architectural Visualization",
    freelancer: "3D Vision",
    freelancerSlug: "3d-vision",
    rating: 4.9,
    reviews: 98,
    delivery: "6 days",
    price: "$600"
  },
  {
    id: 139,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Children's Book Art",
    freelancer: "Artistic Dreams",
    freelancerSlug: "artistic-dreams",
    rating: 4.8,
    reviews: 134,
    delivery: "3 days",
    price: "$250"
  },
  {
    id: 140,
    image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Corporate Identity",
    freelancer: "Brand Masters",
    freelancerSlug: "brand-masters",
    rating: 4.9,
    reviews: 201,
    delivery: "2 days",
    price: "$400"
  },
  {
    id: 141,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Minimalist Logo Pack",
    freelancer: "LogoCraft",
    freelancerSlug: "logocraft",
    rating: 4.8,
    reviews: 512,
    delivery: "3 days",
    price: "$120"
  },
  {
    id: 142,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Vintage Logo Collection",
    freelancer: "RetroMark",
    freelancerSlug: "retromark",
    rating: 4.7,
    reviews: 389,
    delivery: "2 days",
    price: "$110"
  },
  {
    id: 143,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Luxury Brand Logo",
    freelancer: "EliteDesigns",
    freelancerSlug: "elitedesigns",
    rating: 4.9,
    reviews: 210,
    delivery: "4 days",
    price: "$200"
  },
  {
    id: 144,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Startup Logo Kit",
    freelancer: "StartUpArt",
    freelancerSlug: "startupart",
    rating: 4.8,
    reviews: 156,
    delivery: "2 days",
    price: "$130"
  },
  {
    id: 145,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Hand-drawn Logo Set",
    freelancer: "SketchyLines",
    freelancerSlug: "sketchylines",
    rating: 4.7,
    reviews: 98,
    delivery: "3 days",
    price: "$140"
  },
  {
    id: 146,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Corporate Logo Design",
    freelancer: "BizLogo",
    freelancerSlug: "bizlogo",
    rating: 4.8,
    reviews: 134,
    delivery: "2 days",
    price: "$160"
  },
  {
    id: 147,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Colorful Logo Concepts",
    freelancer: "ColorSplash",
    freelancerSlug: "colorsplash",
    rating: 4.9,
    reviews: 201,
    delivery: "3 days",
    price: "$170"
  },
  {
    id: 148,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Monogram Logo Design",
    freelancer: "MonoMark",
    freelancerSlug: "monomark",
    rating: 4.8,
    reviews: 99,
    delivery: "2 days",
    price: "$125"
  },
  {
    id: 149,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Geometric Logo Set",
    freelancer: "GeoDesigns",
    freelancerSlug: "geodesigns",
    rating: 4.7,
    reviews: 88,
    delivery: "3 days",
    price: "$135"
  },
  {
    id: 150,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Mascot Logo Pack",
    freelancer: "MascotMakers",
    freelancerSlug: "mascotmakers",
    rating: 4.9,
    reviews: 77,
    delivery: "4 days",
    price: "$180"
  },
  {
    id: 151,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Signature Logo Design",
    freelancer: "SignaArt",
    freelancerSlug: "signaart",
    rating: 4.8,
    reviews: 66,
    delivery: "2 days",
    price: "$145"
  },
  {
    id: 152,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Emblem Logo Collection",
    freelancer: "EmblemWorks",
    freelancerSlug: "emblemworks",
    rating: 4.7,
    reviews: 55,
    delivery: "3 days",
    price: "$155"
  },
  {
    id: 153,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Animated Logo Pack",
    freelancer: "Animotion",
    freelancerSlug: "animotion",
    rating: 4.8,
    reviews: 44,
    delivery: "2 days",
    price: "$165"
  },
  {
    id: 154,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Flat Logo Design",
    freelancer: "FlatArt",
    freelancerSlug: "flatart",
    rating: 4.9,
    reviews: 33,
    delivery: "3 days",
    price: "$175"
  },
];

const categories = ["All", "Logo Design", "Website Design", "Mobile App", "Graphic Design", "Video Editing", "3D Design", "Illustration", "Branding"];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav2 />
      <main className="flex-1 pt-20">
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Made on{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">
                  WorkVix
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
                Discover the amazing projects created by our talented freelancers.
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-8 lg:mb-12">
              <div className="flex items-center justify-center mb-4">
                <span className="text-sm font-medium text-gray-700">Filter by category:</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {project.category}
                      </span>
                    </div>
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {project.price}
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-green-600 transition-colors">
                      {project.title}
                    </h3>
                    {/* Freelancer Name as Link */}
                    <div className="mb-1">
                      <Link to={`/freelancer/${project.freelancerSlug}`} className="text-green-700 hover:underline font-medium text-xs sm:text-sm">
                        {project.freelancer}
                      </Link>
                    </div>
                    {/* Rating and Reviews */}
                    <div className="flex items-center text-xs sm:text-sm text-yellow-600 mb-1">
                      <span className="font-semibold">{project.rating}★</span>
                      <span className="ml-1 text-gray-500">({project.reviews} reviews)</span>
                    </div>
                    {/* Delivery Time */}
                    <div className="text-xs sm:text-sm text-gray-500 mb-2">
                      Delivery: {project.delivery}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-bold text-gray-900">
                        {project.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
