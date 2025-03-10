import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import CreateGroupModal from "./CreateGroupModal"; // Import the modal component
Facebook

const Sidebar = () => {
  const { getUsers, getGroups, users, groups, selectedChat, setSelectedChat, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false); // Track modal state

  

  useEffect(() => {
    getUsers();
    getGroups();
  }, []);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user.id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Contact className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <button onClick={() => setIsCreateGroupOpen(true)} className="hidden lg:flex items-center gap-2 btn btn-ghost btn-circle">
          <Users className="size-6" />
        </button>
      </div>

        
      
      {/* Filter toggle */}
      <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1 <0 ? 0 :onlineUsers.length - 1} online)</span>
        </div>
        </div>

      <div className="overflow-y-auto w-full py-3">
      {!showOnlineOnly&&
      <>
      {/* Group Chats */}
      {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => setSelectedChat({ ...group, type: "group" })}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedChat?.id === group.id && selectedChat?.type === "group" ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img src={group.profilepic || "/avatar.png"} alt={group.name} className="size-12 object-cover rounded-full" />
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{group.name}</div>
              <div className="text-sm text-zinc-400">group</div>
            </div>
          </button>
        ))}
        </>
        }

        {/* User Chats */}
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() =>{
            setSelectedChat({ ...user, type: "user" })}}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedChat?.id === user.id && selectedChat?.type === "user" ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img src={user.profilepic || "/avatar.png"} alt={user.fullname} className="size-12 object-cover rounded-full" />
              {onlineUsers.includes(user.id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-zinc-400">{onlineUsers.includes(user.id) ? "Online" : "Offline"}</div>
            </div>
          </button>
        ))}

        
      </div>
    </aside>
    {/* Create Group Modal */}
    {isCreateGroupOpen && <CreateGroupModal onClose={() => setIsCreateGroupOpen(false)} />}
    </>
  );
};

export default Sidebar;
