import { Sidebar } from './components/Sidebar';
import { VideoContainer } from './components/VideoContainer';

function App() {
  return (
    <div className='w-full h-screen'>
      <div className='flex flex-row'>
        <div className='flex-1'>
          <VideoContainer />
        </div>
        <div className='w-1/4'>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
