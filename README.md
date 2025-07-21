# Alexandra Neagu - Portfolio Website

A clean, professional portfolio website showcasing my projects, education, and experience.

🌐 **Live Website**: [https://neagualexa.github.io](https://neagualexa.github.io)

## 📖 About

This portfolio website presents my academic journey, research focus on Large Language Models in STEM education, and various projects from my MEng in Electrical and Electronic Engineering at Imperial College London.

## 🗂️ Content Management

This website uses a **data-driven approach** where all content is stored in JSON files located in the `src/data/` folder. This makes it easy to update content without modifying React components.

## 🔧 Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Setup using instructions from [https://github.com/gitname/react-gh-pages](https://github.com/gitname/react-gh-pages)

### Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/neagualexa/neagualexa.github.io.git
   cd neagualexa.github.io
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Deploying to GitHub Pages

#### Deploy the React App

```bash
npm run deploy
```

This command runs the `predeploy` and `deploy` scripts defined in `package.json`:
- **predeploy**: Builds a distributable version of the React app in the `build` folder
- **deploy**: Pushes the build contents to the `gh-pages` branch of the GitHub repository

You can specify a custom commit message:
```bash
npm run deploy -- -m "Deploy React app to GitHub Pages"
```

#### Configure GitHub Pages (One-time setup)

1. **Navigate to GitHub repository settings**:
   - Go to your GitHub repository
   - Click on the "Settings" tab
   - In the sidebar, under "Code and automation", click on "Pages"

2. **Configure Build and deployment settings**:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
   - Click "Save"

#### Store Source Code on GitHub

After deployment, commit and push your source code:

```bash
git add .
git commit -m "Configure React app for deployment to GitHub Pages"
git push origin main
```

**Repository Structure**:
- `main` branch: Contains the React app source code
- `gh-pages` branch: Contains the built/distributable version

## 🏗️ Project Structure

```
src/
├── components/           # All reusable React components
├── pages/               # Top-level page components
│   ├── HomePage.js      # Home page
│   ├── ProjectsPage.js  # Projects page
│   └── ResumePage.js    # Resume page
├── data/                # JSON content files
│   ├── personalInfo.json
│   ├── projectsData.json
│   └── resumeData.json
├── App.js               # Main application component
├── index.js             # Application entry point
└── styles.css           # Global styles
```

---

© 2024 Alexandra Neagu. Built with ❤️ for GitHub Pages.
