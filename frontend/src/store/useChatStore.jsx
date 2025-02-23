import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios.lib.js";
import useAuthStore from "./useAuthStore.jsx";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],   // Store groups here
  selectedChat: null,  // Can be a user or group
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getGroups: async () => {
    try {
      const res = await axiosInstance.get(`/groups/user`); 
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  addMembers: async(membersData)=>{
    try {
      const{data}=axiosInstance.post('groups/add-member',membersData);
      toast.success("Memebers added successfully")
    } catch (error) {
      console.log(error.message);
      toast.error(error?.message);
    }
    
  },

  createGroup: async(groupData)=>{
    try {
        const {data}=axiosInstance.post('groups/create',groupData);
    } catch (error) {
      console.log(error.message);
    }
  },

  getMessages: async (chat) => {
    set({ isMessagesLoading: true });
    try {
      const endpoint = chat.type === "user"
        ? `/messages/${chat.id}`
        : `/groups/messages/${chat.id}`;

      const res = await axiosInstance.get(endpoint);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedChat, messages } = get();
    try {
      const endpoint = selectedChat.type === "user"
        ? `/messages/send/${selectedChat.id}`
        : `/groups/send/${selectedChat.id}`;

      const res = await axiosInstance.post(endpoint, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  setSelectedChat: (chat) => set({ selectedChat: chat }),

  subscribeToMessages: () => {
    const { selectedChat } = get();
    if (!selectedChat) return;

    const socket = useAuthStore.getState().socket;


      socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.sender_id === selectedChat.id;
      if (!isMessageSentFromSelectedUser) return;
      set({ messages: [...get().messages, newMessage] });
      });

      socket.on("newGroupMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.group_id === selectedChat.id;
      if (!isMessageSentFromSelectedUser) return;
      set({ messages: [...get().messages, newMessage] });
      });

   
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("newGroupMessage");
  },
}));

