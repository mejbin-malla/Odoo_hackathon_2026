# TransitOps

TransitOps is a modern fleet management and transit operations dashboard built for hackathons and scale. It provides comprehensive tools for managing vehicles, drivers, trips, maintenance schedules, and financials.

## 🚀 Features

- **Fleet Management**: Track vehicle status, maintenance records, and assignments.
- **Driver Onboarding**: Seamless driver registration with automated verification tracking.
- **Trip Scheduling**: Dispatch vehicles and monitor trip statuses (Scheduled, In Progress, Completed).
- **Secure Authentication**: Passwordless OTP authentication, Two-Factor Authentication (2FA), and secure password resets powered by [Better Auth](https://better-auth.com/).
- **Analytics & Financials**: Monitor revenue, expenses, and operational efficiency through an intuitive dashboard.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database**: SQLite with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Emails**: [Resend](https://resend.com/) (OTP and 2FA emails)
- **Icons**: Lucide React

## 📦 Getting Started

### 1. Clone & Install Dependencies
\`\`\`bash
git clone https://github.com/your-username/transitops.git
cd transitops
npm install
\`\`\`

### 2. Environment Variables
Create a \`.env.local\` file in the root of your project and configure the following variables:

\`\`\`env
# Database Configuration
DATABASE_URL="file:./transitops.db"

# Better Auth Configuration
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="generate-a-secure-random-secret-here"

# Email Configuration (Resend)
RESEND_API_KEY="your_resend_api_key_here"
\`\`\`

### 3. Database Setup
Push the Drizzle schema to your local SQLite database to create the tables:
\`\`\`bash
npx drizzle-kit push
\`\`\`

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔐 Authentication Note (Resend Free Tier)
If you are using Resend's free tier without a verified custom domain, Resend will **only** send emails to the exact email address you registered your Resend account with. 

To test OTPs locally, ensure you are signing up on the login page using your registered Resend email address (e.g., \`your_email@gmail.com\`). 

## 📁 Project Structure

- \`/src/app\`: Next.js App Router pages (Dashboard, Login, Settings, etc.)
- \`/src/components\`: Reusable UI components (shadcn/ui)
- \`/src/db\`: Drizzle ORM schema and database connection logic
- \`/src/actions\`: Server Actions for mutating data (Drivers, Vehicles, Trips)
- \`/src/lib\`: Utility functions (Authentication, Email sending)

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
