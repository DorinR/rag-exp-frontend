import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { Avatar, Button, Text } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="rounded-xl bg-white shadow-md">
      <div className="mx-auto px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-4 no-underline">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <ChatBubbleIcon className="h-5 w-5 text-white" />
            </div>
            <Text size="5" weight="bold" className="text-gray-900">
              RAG Explorer
            </Text>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar
                    size="2"
                    radius="full"
                    fallback={user?.email?.[0].toUpperCase() || '?'}
                    color="blue"
                  />
                  <Text size="2" weight="medium" className="text-gray-700">
                    {user?.email}
                  </Text>
                </div>
                <Button onClick={handleLogout} variant="soft" color="gray" size="2">
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="soft" color="gray" size="2" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button size="2" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
