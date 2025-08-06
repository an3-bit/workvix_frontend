import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming you use shadcn/ui Button

const UrgentHelpButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/post-job');
  };

  return (
    <Button
      className="fixed bottom-4 right-4 bg-red-600 text-white rounded-full px-6 py-3 text-lg font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 animate-blink z-50"
      onClick={handleClick}
    >
      Need urgent help? Click here
    </Button>
  );
};

export default UrgentHelpButton;