
const categories = [
  {
    title: "Categories",
    links: [
      "Graphics & Design",
      "Digital Marketing",
      "Writing & Translation",
      "Video & Animation",
      "Music & Audio",
      "Programming & Tech",
      "Business",
      "Lifestyle",
    ],
  },
  {
    title: "About",
    links: [
      "Careers",
      "Press & News",
      "Partnerships",
      "Privacy Policy",
      "Terms of Service",
      "Intellectual Property",
      "Investor Relations",
    ],
  },
  {
    title: "Support",
    links: [
      "Help & Support",
      "Trust & Safety",
      "Selling on SkillForge",
      "Buying on SkillForge",
    ],
  },
  {
    title: "Community",
    links: [
      "Customer Success Stories",
      "Community Hub",
      "Forum",
      "Events",
      "Blog",
      "Influencers",
      "Affiliates",
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.title}>
              <h3 className="font-bold text-lg mb-4">{category.title}</h3>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-600 hover:text-skillforge-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <div className="mb-4 md:mb-0">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-skillforge-primary">
                Skill<span className="text-skillforge-secondary">Forge</span>
              </span>
            </a>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-skillforge-primary">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.992 3.656 9.129 8.438 9.879V14.89h-2.54v-2.89h2.54V9.796c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.129 22 16.992 22 12z" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-skillforge-primary">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-skillforge-primary">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.98 0a6.9 6.9 0 01.702.031c.183.012.396.028.584.055.188.027.374.05.523.098.14.03.335.088.488.152.162.05.32.106.476.186.155.08.3.174.441.287.14.113.274.241.392.387.118.142.239.304.348.465.108.163.203.335.284.506.08.17.154.353.199.51.048.186.072.38.082.559.01.18.014.448.014.448v11.91c0 .3-.019.565-.028.748-.01.167-.03.329-.062.5-.033.17-.075.338-.124.506-.05.168-.118.336-.191.5a5.79 5.79 0 01-.264.485 5.507 5.507 0 01-.336.465 5.629 5.629 0 01-.392.387c-.14.113-.285.207-.441.287-.155.08-.313.136-.476.186-.153.064-.347.12-.488.152-.15.048-.335.071-.523.098-.188.026-.401.043-.584.055a7.307 7.307 0 01-.702.031H7.021a6.9 6.9 0 01-.702-.031 6.664 6.664 0 01-.584-.055c-.188-.027-.374-.05-.523-.098-.14-.03-.335-.088-.488-.152a2.858 2.858 0 01-.467-.185 2.546 2.546 0 01-.45-.288 2.808 2.808 0 01-.983-1.358 5.379 5.379 0 01-.199-.51 3.05 3.05 0 01-.082-.56c-.01-.18-.014-.447-.014-.447V7.021c0-.3.019-.565.028-.748.01-.167.03-.329.062-.5.033-.17.075-.338.124-.506.05-.168.118-.336.191-.5a5.79 5.79 0 01.264-.485 5.507 5.507 0 01.336-.465 5.629 5.629 0 01.392-.387c.14-.113.285-.207.441-.287.155-.08.313-.136.476-.186.153-.064.347-.12.488-.152.15-.048.335-.071.523-.098.188-.026.401-.043.584-.055a7.307 7.307 0 01.702-.031h9.959z" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-skillforge-primary">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>&copy; {new Date().getFullYear()} SkillForge Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
