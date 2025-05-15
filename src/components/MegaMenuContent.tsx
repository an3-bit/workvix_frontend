import React from 'react';
import { Link } from 'react-router-dom';

export const MegaMenuContent = ({ sections }) => {
  return (
    <div className="w-[900px] p-6 bg-white rounded-md shadow-lg">
      <div className="grid grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item}>
                  <Link 
                    to={`/services/${encodeURIComponent(section.title.toLowerCase())}/${encodeURIComponent(item.toLowerCase())}`}
                    className="text-sm text-gray-600 hover:text-skillforge-primary transition-colors flex items-center"
                  >
                    {item}
                    {item.includes("NEW") && (
                      <span className="ml-2 inline-flex items-center rounded-md bg-pink-50 px-1.5 py-0.5 text-xs font-medium text-pink-700">
                        NEW
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// // Enhanced MegaMenu component
// const MegaMenu = ({ sections }) => {
//   return (
//     <div className="w-full bg-white p-4 shadow-lg">
//       <div className="container mx-auto">
//         <div className="grid grid-cols-6 gap-4">
//           {sections.map((section, index) => (
//             <div key={index} className="space-y-2">
//               <h3 className="font-medium text-sm text-skillforge-primary border-b pb-1">{section.title}</h3>
//               <ul className="space-y-1">
//                 {section.items.map((item, itemIndex) => (
//                   <li key={itemIndex}>
//                     <Link 
//                       to="#" 
//                       className="text-xs text-gray-600 hover:text-skillforge-primary flex items-center gap-1"
//                     >
//                       {item}
//                       {item.includes("NEW") && (
//                         <span className="bg-pink-100 text-pink-600 text-xs px-1 py-0.5 rounded-full text-[10px]">NEW</span>
//                       )}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
