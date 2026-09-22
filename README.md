# 📖 IlmPath

### An E-Learning React Native Application for Learning the Holy Quran

IlmPath is a **React Native-based e-learning application** designed to provide a dedicated digital experience for learning and engaging with the Holy Quran.

The project combines a mobile application with a backend and database environment, providing a foundation for building an accessible and modern Quran-learning platform.

---

## 🎥 Demo

Take a look at IlmPath in action:

[![IlmPath Demo](https://img.youtube.com/vi/CQxSsO0P8WM/maxresdefault.jpg)](https://www.youtube.com/watch?v=CQxSsO0P8WM)

> ▶️ **Click the image above to watch the IlmPath demo.**

---

## ✨ Overview

IlmPath was developed as a mobile e-learning application with the goal of making Quranic learning accessible through a modern mobile interface.

The project consists of:

* 📱 A React Native mobile application
* ⚙️ A backend environment
* 🗄️ A Docker-based database setup
* 🧪 Jest testing configuration
* 🔧 A JavaScript/npm-based development workflow

The application is structured so that the frontend and backend can be developed and run together as a complete application.

---

## 🛠️ Tech Stack

### Mobile Application

* **React Native**
* **JavaScript**
* **npm**

### Backend & Infrastructure

* **Node.js**
* **Docker**
* **Docker Compose**
* Backend API

### Testing

* **Jest**

---

## 🏗️ Project Structure

```text
IlmPath/
│
├── IlmPath/
│   │
│   ├── ... React Native application
│   │
│   └── backend/
│       ├── ...
│       └── docker-compose.yml
│
├── jest.config.js
├── README.md
└── ...
```

The main application lives inside the `IlmPath` directory, while the backend and database configuration are located inside the `backend` directory.

---

## 🚀 Getting Started

Follow the steps below to run IlmPath locally.

### Prerequisites

Before running the project, make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm
* [Docker](https://www.docker.com/)
* Docker Compose
* A React Native development environment

---

### 1. Clone the Repository

```bash
git clone https://github.com/0AbdullahSajjad0/IlmPath.git
```

Navigate into the repository:

```bash
cd IlmPath
```

---

### 2. Install Dependencies

Navigate to the application directory:

```bash
cd IlmPath
```

Install the required dependencies:

```bash
npm install
```

or:

```bash
npm i
```

This will download and install the dependencies required by the project.

---

### 3. Set Up the Database

Navigate to the backend directory:

```bash
cd backend
```

Start the backend/database environment using Docker Compose:

```bash
docker-compose up --build
```

Docker will build the required services and start the backend environment.

---

### 4. Start the Application

Return to the main `IlmPath` application directory:

```bash
cd ..
```

Start the React Native application:

```bash
npm start
```

Follow the React Native development workflow to launch the application on your emulator, simulator, or connected device.

---

## 🧪 Testing

The project includes a Jest configuration for testing.

To run the available tests:

```bash
npm test
```

For a more detailed test output, you can use the appropriate Jest options configured for your local development environment.

---

## 📱 Application Demo

The video below provides a visual walkthrough of the application and demonstrates the IlmPath user experience.

### ▶️ Watch the Demo

[![Watch IlmPath Demo](https://img.youtube.com/vi/CQxSsO0P8WM/maxresdefault.jpg)](https://www.youtube.com/watch?v=CQxSsO0P8WM)

**YouTube:** https://youtube.com/shorts/CQxSsO0P8WM

---

## 📸 Screenshots

Screenshots can be added here to showcase the application's interface.

### Home Screen

```text
Add your home-screen screenshot here
```

### Learning Experience

```text
Add your learning-screen screenshot here
```

### Application Navigation

```text
Add additional application screenshots here
```

> **Tip:** For the best GitHub presentation, add 3–5 screenshots showing the most important parts of the application.

You can store them in a dedicated folder:

```text
screenshots/
├── home.png
├── learning.png
├── navigation.png
└── ...
```

Then display them using Markdown:

```markdown
![IlmPath Home Screen](screenshots/home.png)
```

---

## 🎯 Project Objectives

The main objectives of IlmPath are to:

* Provide a dedicated mobile platform for Quranic learning
* Create an accessible and intuitive learning experience
* Build a modern React Native application
* Connect the mobile application with a backend environment
* Use containerized infrastructure for development
* Establish a foundation that can be extended with additional educational functionality

---

## 🔮 Future Improvements

IlmPath can be extended with additional features as the project evolves.

Possible future improvements include:

* 🔊 Quran recitation and audio playback
* 🔎 Quran search functionality
* 📚 Structured Quran-learning courses
* 📊 User learning progress
* 🏆 Learning achievements and milestones
* 🔔 Learning reminders
* 🌐 Multi-language support
* 👤 Personalized user profiles
* 📥 Offline learning capabilities
* 🎧 Advanced audio controls
* 📈 Learning statistics and progress tracking

---

## 🧩 Architecture

At a high level, IlmPath follows a mobile-client and backend architecture:

```text
                 ┌──────────────────────┐
                 │      IlmPath App     │
                 │    React Native      │
                 └──────────┬───────────┘
                            │
                            │ API Requests
                            ▼
                 ┌──────────────────────┐
                 │       Backend        │
                 │     Node.js/API      │
                 └──────────┬───────────┘
                            │
                            │ Database Access
                            ▼
                 ┌──────────────────────┐
                 │       Database       │
                 │   Docker Environment │
                 └──────────────────────┘
```

This separation allows the mobile application and backend services to be developed independently while communicating through the backend API.

---

## 📂 Development

The project can be developed locally using the following general workflow:

```text
Clone Repository
       │
       ▼
Install Dependencies
       │
       ▼
Start Docker Services
       │
       ▼
Start React Native Application
       │
       ▼
Run / Test Application
```

---

## 🐛 Issues

If you find a bug or have a suggestion, feel free to open an issue in the GitHub repository.

When reporting an issue, please include:

* A description of the problem
* Steps to reproduce it
* Expected behavior
* Actual behavior
* Screenshots or logs where applicable

---

## 📌 Project Status

IlmPath is an ongoing project and can be expanded with additional Quranic learning functionality, improved user experiences, and further backend capabilities.

---

## 👨‍💻 Author

### Abdullah Sajjad

GitHub: [@0AbdullahSajjad0](https://github.com/0AbdullahSajjad0)

---

## 📄 License

Please refer to the repository for the applicable license information.

---

## ❤️ Acknowledgements

IlmPath was created with the goal of using modern software development technologies to build a meaningful and accessible Quran-learning experience.

---

<p align="center">
  <strong>📖 IlmPath</strong>
  <br>
  Learn. Explore. Grow.
</p>
