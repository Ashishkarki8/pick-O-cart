import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/auth-slice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <div className="text-xl font-bold">
        {user?.role === 'admin' ? 'Admin Dashboard' : 'Shop'}
      </div>
      <button 
        onClick={handleLogout}
        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;