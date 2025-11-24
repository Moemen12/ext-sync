# @saadeh/ext-sync

> 🔄 A simple CLI tool for syncing and sharing VS Code/Cursor/Antigravity extensions across teams and projects.

[![npm version](https://img.shields.io/npm/v/@saadeh/ext-sync.svg)](https://www.npmjs.com/package/@saadeh/ext-sync)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Why ext-sync?

Ever joined a new project and spent hours installing the "right" extensions? Or wanted your entire team to use the same development setup? **ext-sync** solves this by letting you:

- 📦 **Import** your current extensions into a shareable config file
- 🔄 **Sync** extensions from a config file (perfect for onboarding)
- 🎯 **Initialize** projects with stack-specific extensions (React, Laravel, NestJS, JavaScript)
- ⚡ **Smart filtering** - only installs extensions you don't already have

## 📥 Installation

```bash
npm install -g @saadeh/ext-sync
```

## 🎮 Usage

Simply run:

```bash
ext-sync
```

You'll see an interactive menu with three options:

### 1. Initialize new setup

Choose your tech stack and install recommended extensions:

```bash
? What are you working with?
❯ React
  Laravel
  NestJS
  JavaScript
```

The tool will:

- ✅ Check which extensions you already have
- ⚡ Only install missing ones
- 🔄 **Merge** with existing config if you run it again (e.g., add Laravel to your React setup)
- 💾 Save your setup to `ext-sync.json`

### 2. Sync extensions

Install all extensions from an existing `ext-sync.json` file:

```bash
ext-sync
# Select "Sync extensions"
```

Perfect for:

- 🆕 New team members
- 💻 Setting up a new machine
- 🔄 Keeping everyone's setup consistent

### 3. Import extensions

Snapshot your current extensions into `ext-sync.json`:

```bash
ext-sync
# Select "Import extensions"
```

Great for:

- 📸 Capturing your perfect setup
- 🤝 Sharing with your team
- 📦 Version controlling your editor config

## 📁 Configuration File

The `ext-sync.json` file supports **multiple stacks**:

```json
{
  "editor": "antigravity",
  "stacks": ["react", "laravel"],
  "extensions": {
    "react": [
      "dsznajder.es7-react-js-snippets",
      "esbenp.prettier-vscode",
      "dbaeumer.vscode-eslint"
    ],
    "laravel": [
      "bmewburn.vscode-intelephense-client",
      "onecentlin.laravel-blade"
    ]
  }
}
```

**Commit this file to your repo** so your team can sync instantly!

## 🎯 Supported Editors

- ✅ **VS Code** (including Snap installations)
- ✅ **Cursor**
- ✅ **Antigravity**

The tool automatically detects which editor you're using.

## 🛠️ Supported Stacks

**Frontend:**

- ⚛️ React / React Native
- 🟢 Vue.js
- 🅰️ Angular
- 🟠 Svelte
- 💛 JavaScript / TypeScript

**Backend:**

- 🐘 Laravel (PHP)
- 🦁 NestJS
- 🐍 Python
- ☕ Java
- 🐹 Go
- 🦀 Rust
- 🇨 C/C++
- 🔷 C# (.NET)

**Mobile:**

- 📱 Flutter
- 🤖 Kotlin (Android)
- ⚛️ React Native

> 💡 **Curious about what's installed?**
> Check out the full list of curated extensions in [src/data/extensions.js](./src/data/extensions.js). We include essential tools (Prettier, ESLint) plus productivity boosters (GitLens, snippets, etc.) for each stack.

## 🤝 Team Workflow

1. **Developer A** (project lead):

   ```bash
   ext-sync
   # Select "Import extensions"
   git add ext-sync.json
   git commit -m "Add editor extensions config"
   ```

2. **Developer B** (new team member):
   ```bash
   git clone your-repo
   cd your-repo
   ext-sync
   # Select "Sync extensions"
   ```

Done! Developer B now has the exact same extensions.

## 🔧 Requirements

- Node.js >= 20.0.0
- One of: VS Code, Cursor, or Antigravity

## 📝 License

MIT © [Moemen](https://github.com/Moemen12)

## 🐛 Issues & Contributions

Found a bug or want to contribute? Check out the [GitHub repository](https://github.com/Moemen12/saadehkit).

---

Made with ❤️ by [Moemen](https://github.com/Moemen12)
