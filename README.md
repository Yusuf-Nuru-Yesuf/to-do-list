# To-Do List Application

A simple to-do list application with CRUD (Create, Read, Update, Delete) functionality, built using modern JavaScript and Web Storage API.

## Features
- Add tasks to your to-do list.
- View all tasks.
- Edit existing tasks.
- Delete tasks.
- Persistent storage using the Web Storage API.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Yusuf-Nuru-Yesuf/to-do-list.git
   ```

2. Navigate to the project directory:
   ```bash
   cd to-do-list
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode

To start the application in development mode with hot reloading:

```bash
npm run dev
```

This will start a development server, and you can access the application at `http://localhost:8080`.

### Build for Production

To build the application for production:

```bash
npm run build
```

The compiled files will be available in the `dist/` directory.

### Open the Application

1. After building the project, open the `dist/index.html` file in your browser to use the application.

## Project Structure

```
|-- src/
|   |-- scripts/       # Every Scripts of the app 
|   |-- styles/        # Application styles
|   |-- templates/     # Templatesof the app
|-- dist/              # Compiled output (after build)
|-- webpack.config.js  # Webpack configuration
|-- package.json       # Project metadata and scripts
```

## Built With

- **JavaScript (ES6+)** - Core language for the application.
- **Webpack** - Module bundler.
- **CSS Loader & Style Loader** - For handling CSS imports in JavaScript.
- **date-fns** - For date manipulation.
- **Web Storage API** - For storing tasks locally.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## Author

Yusuf Nuru Yesuf
---

Feel free to customize this README further to suit your project and preferences!

