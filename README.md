# Feedbackhub

## A project created while learning Next.js and NextJs API Routes

An elegant platform for collecting anonymous feedback and messages. True Feedback helps you gather honest insights by providing a simple way for others to share feedback without revealing their identity.


## 🌟 Features

- **Anonymous Messaging**: Allow others to send you completely anonymous feedback
- **User Dashboard**: Manage and view all received messages in one place
- **Privacy Controls**: Toggle message acceptance on/off as needed
- **Shareable Profile Links**: Easily share your unique profile link to receive feedback
- **Responsive Design**: Optimized for all devices - mobile, tablet, and desktop
- **User Authentication**: Secure login and registration system
- **Message Management**: Delete unwanted messages or save important ones

## 🚀 Technologies Used

- **Frontend**: 
  - Next.js 14 with App Router
  - React 18
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Lucide Icons

- **Backend**: 
  - Next.js API Routes
  - MongoDB for data storage
  - NextAuth.js for authentication

## 🛠️ Installation and Setup

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB instance (local or Atlas)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/bPavan16/feedbackhub.git
   cd feedbackhub
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📋 Usage

### Creating an Account

1. Navigate to the Sign Up page
2. Enter your desired username, email, and password
3. Verify your email if required
4. Log in with your new credentials

### Getting Feedback

1. Share your unique profile link with others (`yourdomain.com/u/yourusername`)
2. Recipients can send anonymous messages through your profile page
3. View and manage all received messages in your dashboard

### Managing Messages

1. Access your dashboard to see all received messages
2. Toggle the "Accept Messages" switch to control whether new messages are allowed
3. Delete any unwanted messages with the trash icon
4. View message timestamps and other details

## 📁 Project Structure

```
feedbackhub/
├── src/
│   ├── app/
│   │   ├── (app)/            # Main application routes
│   │   │   ├── dashboard/    # User dashboard
│   │   │   └── page.tsx      # Home page
│   │   ├── (auth)/           # Authentication routes
│   │   │   ├── sign-in/      # Sign in page
│   │   │   └── sign-up/      # Sign up page
│   │   └── u/[username]/     # Public user profile pages
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── MessageCard.tsx   # Message display component
│   │   └── Navbar.tsx        # Navigation component
│   ├── context/              # React context providers
│   ├── model/                # Data models
│   ├── schemas/              # Validation schemas
│   └── types/                # TypeScript type definitions
└── public/                   # Static files
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)

---

Developed with ❤️ by [PavanHb]
