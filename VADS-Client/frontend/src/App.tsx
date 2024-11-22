import { AuthProvider } from './components/AuthProvider';
import { BottomBar } from './components/BottomBar';
import { Sidebar } from './components/Sidebar';
import { UserProvider } from './components/UserContext';
import { VideoContainer } from './components/VideoContainer';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <div style={{ backgroundColor: '#444444', height: '1026px', width: '1897px'}}>
          <div style={{ display: 'flex',  flexDirection: 'row'}}>
            <div>
              <VideoContainer />
              <BottomBar/>
            </div>
            <div>
              <Sidebar />
            </div>
          </div>
        </div>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
