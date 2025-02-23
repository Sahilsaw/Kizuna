import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X,UsersRound,Book,Camera } from "lucide-react";
import MultiSelectSearch from "./MultiSelectSearch";
import toast from "react-hot-toast";

const CreateGroupModal = ({ onClose }) => {
  const { users,createGroup, getGroups } = useChatStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profilepic, setProfilepic] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  
  const options=users.map((user)=>{
    return {value:user.id,label:user.fullname}
  })

  const handleSubmit = async () => {
    const selectedIDs=selectedValues.map(v=>v.value);
    try {
      await createGroup({name,description,profilepic,selectedIDs});
      await getGroups();
      toast.success("Successfully created group");
    } catch (error) {
      toast.error(error?.message)
    }
    finally{
      onClose();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
    const base64Image = reader.result;
    setProfilepic(base64Image);
    };
  };



  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
    <div onClick={onClose} className="fixed inset-0 bg-black/50 -z-1"/>
      <div className="space-y-6 bg-base-200 p-6 rounded-lg w-100 max-h-100 overflow-auto">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mt-2">Create Group</h1>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost ">
              <X className="size-6" />
            </button>
        </div>

        <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={profilepic || "/avatar.png"}
                alt="Profile"
                className="size-28 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                `}
              >
                <Camera className="w-4 h-4 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

        <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                  <UsersRound className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
        </div>

        <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                  <Book className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
        </div>
            
        <MultiSelectSearch 
        options={options}
        selectedItems={selectedValues}
        onSelectionChange={setSelectedValues}
        placeholder="Add Users"
      />

        <button onClick={handleSubmit} className="btn btn-primary w-full">
          Create Group
        </button>
      </div>
    </div>
  );
};

export default CreateGroupModal;
