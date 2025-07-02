import { Eye, ArrowRight, Filter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const projects = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
    title: "Modern Brand Identity",
    freelancer: "DesignStudio Pro",
    rating: 4.9,
    price: "$150"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
    title: "E-commerce Platform",
    freelancer: "WebCraft Solutions",
    rating: 4.8,
    price: "$500"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
    title: "Fitness Tracking App",
    freelancer: "AppDev Masters",
    rating: 4.9,
    price: "$800"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
    title: "Marketing Campaign",
    freelancer: "Creative Studio",
    rating: 4.7,
    price: "$200"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
    title: "Product Launch Video",
    freelancer: "VideoPro",
    rating: 4.8,
    price: "$300"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
    title: "Architectural Visualization",
    freelancer: "3D Vision",
    rating: 4.9,
    price: "$600"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
    title: "Children's Book Art",
    freelancer: "Artistic Dreams",
    rating: 4.8,
    price: "$250"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
    title: "Corporate Identity",
    freelancer: "Brand Masters",
    rating: 4.9,
    price: "$400"
  },
];

const categories = ["All", "Logo Design", "Website Design", "Mobile App", "Graphic Design", "Video Editing", "3D Design", "Illustration", "Branding"];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
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
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
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
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>

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
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-500 text-xs sm:text-sm mb-3">
                  by <span className="font-medium text-gray-700">{project.freelancer}</span>
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <span className="font-medium text-yellow-600 mr-1">★</span>
                    <span>{project.rating}</span>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    {project.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
            <p className="text-gray-500">Try selecting a different category or check back later.</p>
          </div>
        )}
        
        {/* CTA */}
        <div className="text-center mt-12 lg:mt-16">
          <Link 
            to="/projects"
            className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="text-sm sm:text-base">Explore More Projects</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
