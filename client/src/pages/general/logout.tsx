import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <button className="bg-gray-200 px-4 py-2 rounded-md" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
