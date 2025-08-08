import { Button } from '@/components/ui/button'; // Assuming you use shadcn/ui Button
// import { FaComment } from 'react-icons/fa'; // Using the comment icon from react-icons/fa

const UrgentHelpButton = () => {

  const handleClick = () => {
    // Open the tawk.to chat widget
    // This assumes the tawk.to script is already loaded in index.html
    // @ts-ignore
    if (typeof Tawk_API !== 'undefined') { Tawk_API.maximize(); }
  };

  // return (
  //   <Button
  //     className="fixed bottom-4 right-4 bg-green-600 text-white rounded-full px-6 py-3 text-lg font-semibold shadow-lg hover:bg-green-700 transition-all duration-300 animate-blink z-50"
  //     onClick={handleClick}
  //   >
  //     Urgent Help
  //   </Button>
  // );
};

export default UrgentHelpButton;