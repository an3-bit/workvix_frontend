import { useLocation } from 'react-router-dom';
import UrgentHelpButton from './UrgentHelpButton';

const ButtonWithLocationCheck = () => {
  const location = useLocation();
  const currentPathname = location.pathname;

  if (currentPathname !== '/post-job') {
    return <UrgentHelpButton />;
  }

  return null;
};

export default ButtonWithLocationCheck;