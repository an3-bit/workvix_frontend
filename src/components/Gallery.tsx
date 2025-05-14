
const projects = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Logo Design",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Website Design",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Mobile App",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Graphic Design",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Video Editing",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&h=300&q=80",
    category: "3D Design",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Illustration",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1561070791-36c11767b26a?auto=format&fit=crop&w=400&h=300&q=80",
    category: "Branding",
  },
];

const Gallery = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Made on SkillForge</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
            >
              <img 
                src={project.image} 
                alt={project.category} 
                className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <span className="text-white font-medium p-4">{project.category}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a 
            href="#" 
            className="inline-flex items-center justify-center gap-2 font-medium text-skillforge-primary hover:underline"
          >
            Explore more projects
          </a>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
