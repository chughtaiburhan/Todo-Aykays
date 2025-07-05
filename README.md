# Firebase React Todo List App

A full-stack Todo List application built with React, Firebase, and a built-in calendar view. Features Google Sign-In authentication, real-time task management, and a beautiful calendar interface to visualize your tasks.

## Features

- 🔐 **Google Sign-In Authentication** - Secure user authentication with Firebase Auth
- 📝 **Task Management** - Create, edit, delete, and mark tasks as completed
- 📅 **Built-in Calendar View** - Visualize your tasks on a beautiful calendar interface
- 🔥 **Firebase Firestore** - Real-time database with user-specific data
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🔒 **Security** - Firestore security rules ensure users only access their own data

## Tech Stack

- **Frontend**: React 19, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Calendar**: Built-in calendar component with date-fns
- **Deployment**: Vercel/Netlify ready

## Prerequisites

Before running this project, you'll need:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Firebase account** and project
4. **Firebase account** and project

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd TodoList-firebase
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Authentication** → Sign-in method → Google (enable)
   - **Firestore Database** → Create database → Start in test mode

4. Get your Firebase configuration:
   - Go to Project Settings → General
   - Scroll down to "Your apps" section
   - Click the web icon (</>) to add a web app
   - Copy the firebaseConfig object

5. Update `src/firebase.js` with your configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```



### 3. Firestore Security Rules

Update your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # App header with user info
│   ├── Login.jsx           # Google Sign-In component
│   ├── TaskForm.jsx        # Add/Edit task form
│   ├── TaskItem.jsx        # Individual task display
│   └── TodoList.jsx        # Main task list component
├── contexts/
│   └── AuthContext.jsx     # Authentication context
├── services/
│   └── calendarService.js  # (Not used - replaced with built-in calendar)
├── firebase.js             # Firebase configuration
├── App.jsx                 # Main app component
└── main.jsx               # App entry point
```

## Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Add Tasks**: Click "Add Task" to create new tasks
3. **Set Due Dates**: Add due dates to see tasks on the calendar view
4. **Manage Tasks**: Edit, delete, or mark tasks as completed
5. **Calendar View**: Switch to calendar view to see tasks by date
6. **Filter**: Use the filter buttons to view all, pending, or completed tasks

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:
   ```bash
   firebase init hosting
   ```

3. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## Challenges Faced and Solutions

### 1. Calendar Component Development
**Challenge**: Creating a responsive calendar component that displays tasks by date
**Solution**: Built a custom calendar component using date-fns for date manipulation and Tailwind CSS for styling

### 2. Firestore Security Rules
**Challenge**: Ensuring users can only access their own data
**Solution**: Implemented user-specific queries and proper security rules

### 3. Real-time Updates
**Challenge**: Keeping task list synchronized with Firestore changes
**Solution**: Used Firebase real-time listeners and proper state management

### 4. Date Handling
**Challenge**: Managing timezone differences and date formatting
**Solution**: Used date-fns library for consistent date handling across the app

### 5. Error Handling
**Challenge**: Providing meaningful error messages for different failure scenarios
**Solution**: Implemented comprehensive error handling with user-friendly messages

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id

```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please:

1. Check the Firebase and Google Cloud Console documentation
2. Review the error messages in the browser console
3. Ensure all environment variables are properly set
4. Verify that all APIs are enabled in Google Cloud Console

---

**Note**: This project is for educational purposes and demonstrates full-stack development with Firebase and React. Make sure to follow security best practices when deploying to production.
