
import { useState } from 'react';
import { Brush, Code, Megaphone, FileText, Video, Image, Music, Package, Globe } from 'lucide-react';

const categories = [
  {
    name: "Graphics & Design",
    icon: Brush,
    color: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
  {
    name: "Web Development",
    icon: Code,
    color: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    name: "Digital Marketing",
    icon: Megaphone,
    color: "bg-orange-100",
    textColor: "text-orange-700",
  },
  {
    name: "Writing & Translation",
    icon: FileText,
    color: "bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    name: "Video & Animation",
    icon: Video,
    color: "bg-red-100",
    textColor: "text-red-700",
  },
  {
    name: "Photography",
    icon: Image,
    color: "bg-indigo-100",
    textColor: "text-indigo-700",
  },
  {
    name: "Music & Audio",
    icon: Music,
    color: "bg-pink-100",
    textColor: "text-pink-700",
  },
  {
    name: "Programming & Tech",
    icon: Code,
    color: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    name: "Business",
    icon: Package,
    color: "bg-gray-100",
    textColor: "text-gray-700",
  },
  {
    name: "Lifestyle",
    icon: Globe,
    color: "bg-yellow-100",
    textColor: "text-yellow-700",
  }
];

const Categories = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <div 
              key={category.name}
              className="category-card"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-3`}>
                <category.icon 
                  className={`category-icon h-6 w-6 ${category.textColor}`}
                />
              </div>
              <h3 className="font-medium">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
