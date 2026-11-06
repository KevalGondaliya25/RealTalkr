# Frontend Details

## 🛠️ Getting Started

### ⚙️ Running the Project Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/RealTalkr-AI/RealTalkr-frontend.git
   cd RealTalkr-frontend
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Create a `.env.local` file:**

   Copy `.env.example` (if available) or create a new `.env.local` and fill in the required environment variables.

4. **Run the development server:**

   ```bash
   yarn dev
   ```

   The app will be running on [http://localhost:3000](http://localhost:3000)

---

## 🚀 Production Deployment (AWS Amplify)

This project is deployed on AWS Amplify, connected directly to the GitHub repository.

### ⚠️ Environment Variables Management

1. **Update Environment Variables in Amplify:**

   If you add or update any environment variables in `.env.local`, make sure to also:

   - Go to the Amplify Console.
   - Navigate to:
     `Hosting -> Environment Variables`
   - Add or update the corresponding variables there.

2. **Ensure Build Process Captures Env Variables:**

   Your `amplify.yml` should include the following under `preBuild` to inject environment variables into the production build:

   ```yaml
   preBuild:
     commands:
       - env | grep -e ENV \
         -e NEXTAUTH_URL \
         -e NEXTAUTH_SECRET \
         -e NEXT_PUBLIC_URL \
         -e NEXT_PUBLIC_VAPI_PUBLIC \
         -e NEXT_PUBLIC_WEB_SOCKET_URL \
         -e NEXT_PUBLIC_SECRET_KEY \
         -e NEXT_PUBLIC_RECAPTCHA_SITE_KEY \
         -e NEXT_PUBLIC_RECAPTCHA_SITE_SECRET_KEY \
         -e NEXT_PUBLIC_LANDING_VAPI_ASSISTANT \
         -e NEXT_PUBLIC_LANDING_VAPI_PUBLIC >> .env.production
       - yarn install
   ```

---

Would you like me to help format the full `amplify.yml` file or add CI/CD instructions too?

---

## 🧑‍💻 Development Guidelines

### Coding Standards

- Use **ES6+** syntax and modern JavaScript features.
- Follow a **consistent naming convention** across the codebase.
- Keep functions **short and focused** on a single task.

---

## 🛠 Tools and Resources

### Tools Used

- Next JS
- Redux
- Redux Toolkit
- Tailwind CSS

### Helpful Resources

- [Next JS Documentation](https://nextjs.org/docs)
- [Redux Documentation](https://redux.js.org/docs/introduction/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/installation)
