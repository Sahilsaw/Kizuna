# Kizuna Chat Application

Kizuna is a real-time chat application built with the PERN (PostgreSQL, Express, React, Node.js) stack deployed on AWS.

##  Live Demo

🔗 [Kizuna Chat Application](https://kizuna.work.gd/)

## Deployement

- **Deployed on AWS EC2** - The application is hosted on an AWS EC2 instance.
- **Nginx & PM2** - Used Nginx as the reverse proxy server and PM2 for process management to keep the app running smoothly.
- **SSL Certificate** - Secured the application with an SSL certificate for encrypted communication

##  Features

-  **User Authentication** - Secure login and registration using JWT.
-  **Real-Time Chat** - Instant messaging powered by Socket.io.
-  **Database Storage** - Messages and user data are stored in PostgreSQL.
-  **Modern UI** - Styled with Tailwind CSS and DaisyUI.
-  **Seamless Navigation** - Implemented using React Router.
-  **API Requests** - Managed with Axios.
-  **Toasts for Notifications** - Integrated with React-Hot-Toast.
-  **Backend API** - Built with Express.js and tested using Postman.
-  **CORS & Cookies** - Managed with `cors` and `cookie-parser` for security and session management.

##  Screenshots
![Register Page](./Register%20page.png)

## 🛠 Tech Stack

### Frontend:
- React.js
- Tailwind CSS & DaisyUI
- React-Router-Dom
- Axios
- React-Hot-Toast

### Backend:
- Node.js
- Express.js
- Socket.io
- PostgreSQL
- JWT Authentication
- CORS & Cookie-Parser
- Postman (For API Testing)

##  Installation & Setup

1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-username/chat-application-kizuna.git
   cd chat-application-kizuna
   ```

2. **Backend Setup**
   ```sh
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create a `.env` file in the backend directory and add:
   ```env
   PORT=5000
   SECRET_KEY=                                 
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=                        
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   DATABASE_URL=
   ```


##  Contact
For queries, reach out to me:
- LinkedIn: [linkedin.com/in/sahil-saw](https://linkedin.com/in/sahil-saw)
- Email: sahilsaw23@gmail.com
- GitHub: [github.com/Sahilsaw](https://github.com/Sahilsaw)

---
Happy Coding! 🚀

