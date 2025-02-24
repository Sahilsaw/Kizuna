import { useState,useEffect } from "react";
import { X,UserPlus } from "lucide-react";
import  useAuthStore  from "../store/useAuthStore";
import { useChatStore} from "../store/useChatStore";
import MultiSelectSearch from "./MultiSelectSearch";


const ChatHeader = () => {
  const { selectedChat, setSelectedChat, users, getGroups,addMembers } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  
  useEffect(()=>{
      document.addEventListener('keyup',handleKeyUp)
      return () => {
        document.removeEventListener('keyup',handleKeyUp)
      }
    },[])
  
    const handleKeyUp=(e)=>{
      if(e.key==="Escape"){
        setShowAddMembersModal(false)
      }
    }


  const options=users.map((user)=>{
    return {value:user.id,label:user.fullname}
  })


  const handleAddMembers = async() => {

    const selectedIDs=selectedUserIds.map(v=>v.value);
    try {
      await addMembers({groupId:selectedChat.id,selectedIDs});
      await getGroups();
    } catch (error) {
      console.log(error?.message);
    }
    finally{
      setShowAddMembersModal(false);
      setSelectedUserIds([]);
    }
    
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedChat.profilepic || "/avatar.png"} alt={selectedChat.fullname} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedChat.type=="user"?selectedChat.fullname:selectedChat.name}</h3>
            <p className="text-sm text-base-content/70">
              {selectedChat.type=="user"?onlineUsers.includes(selectedChat.id) ? "Online" : "Offline":selectedChat.description}
            </p>
          </div>
        </div>


        {/* Add Members Modal */}
      {showAddMembersModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
        <div onClick={() => setShowAddMembersModal(false)} className="fixed inset-0 bg-black/50 -z-1"/>
          <div className="space-y-6 bg-base-200 p-6 rounded-lg w-100 max-h-100 overflow-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold mt-2">Add Members</h1>
              <button 
                onClick={() => setShowAddMembersModal(false)}
                className="btn btn-sm btn-circle btn-ghost "
              >
                <X className="size-6" />
              </button>
            </div>

            <MultiSelectSearch 
              options={options}
              selectedItems={selectedUserIds}
              onSelectionChange={setSelectedUserIds}
              placeholder="Add Users"
            />

              <button
                onClick={handleAddMembers}
                className="btn btn-primary w-full"
              >
                Add Members
              </button>
          </div>
        </div>
      )}
      {/* Add Members Modal ends here */}

        {/* Close button */}
        <div className="flex items-center gap-3">
        {selectedChat.type==='group'&&
          <button className="hidden lg:flex btn btn-ghost btn-circle" 
          onClick={() => setShowAddMembersModal(true)}>    
          <UserPlus />
          </button>}
        
        <button onClick={() => setSelectedChat(null)} className="btn btn-ghost btn-circle">
          <X />
        </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;