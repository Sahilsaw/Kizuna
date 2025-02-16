import { create } from "zustand";
import { axiosInstance } from "../libs/axios.lib";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASEURL = "http://localhost:5000";

const useAuthStore = create((set, get) => ({
  user: null,
  socket: null,

  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ user: response.data.user });

      get().connectToSocket();
    } catch (error) {
      console.log("Error at checking authentication", error.message);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ user: res.data.user });

      get().connectToSocket();
      toast.success("Account created successfully");
    } catch (error) {
      console.log("Error in Signup", error.message);
      set({ user: null });
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });

      get().disconnectToSocket();
      toast.success("Successfully logged out");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ user: res.data.user });

      get().connectToSocket();
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-user", data);
      set({ user: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectToSocket: () => {
    const { user, socket } = get();
    if (!user || socket) return;

    const newSocket = io(BASEURL, { 
      query:{
        userID: user.id,
      }
     });

     newSocket.on("getOnlineUsers",(userIDs)=>{
      set({onlineUsers:userIDs});
     })

    set({ socket: newSocket });
  },

  disconnectToSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default useAuthStore;
