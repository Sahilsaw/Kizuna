import { useChatStore } from "../store/useChatStore.jsx";

import Sidebar from "../components/Sidebar.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import ChatContainer from "../components/ChatContainer.jsx";

const HomePage = () => {
  const { selectedChat } = useChatStore();

  return (
      <div className="flex items-center justify-center pt-20 ">
        <div className="bg-base-100 w-full h-[calc(100vh-5rem)]">
          <div className="flex h-full overflow-hidden">

            <Sidebar />
            {!selectedChat ? <NoChatSelected /> : <ChatContainer />}

        </div>
      </div>
    </div>
  );
};
export default HomePage;