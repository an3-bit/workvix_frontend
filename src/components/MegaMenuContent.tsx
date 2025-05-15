
import React from 'react';

type MenuSection = {
  title: string;
  items: string[];
};

type MegaMenuContentProps = {
  sections: MenuSection[];
};

export const MegaMenuContent = ({ sections }: MegaMenuContentProps) => {
  return (
    <div className="w-full max-w-screen-xl p-6 bg-white rounded-md shadow-lg">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="font-medium text-sm text-gray-500">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="block text-sm text-gray-700 hover:text-skillforge-primary"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
