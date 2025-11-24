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

## 📁 Configuration File

The `ext-sync.json` file is dead simple. It just contains a list of your extensions:

```json
{
  "extensions": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "eamodio.gitlens"
  ]
}
```

### 1. Initialize new setup

If you are starting fresh, use the interactive menu to install recommended extensions for your stack (e.g., React, Laravel, Python).

```bash
ext-sync
# Select "Initialize new setup"
```

- 📦 **Installs** recommended extensions for your chosen stack.
- 💾 **Creates** `ext-sync.json` with these extensions.
- ➕ **Appends** to the list if you run it again for another stack.

### 2. Import existing extensions

If you already have a perfect setup, save it!

```bash
ext-sync
# Select "Import extensions"
```

- 📥 **Reads** all your currently installed extensions.
- 💾 **Saves** them to `ext-sync.json`.
- 🔄 **Merges** with existing list if the file already exists.

### 3. Sync extensions

Install everything in your config to your current editor.

```bash
ext-sync
# Select "Sync extensions"
```

- 🚀 **Installs** all extensions listed in `ext-sync.json`.
- ⚡ **Efficient**: Only installs what is missing.
- 🕵️ **Smart**: Automatically detects if you are using VS Code, Cursor, or Antigravity.

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
