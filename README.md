# NestJS Starter Kit Documentation

This repository contains the documentation website for the [NestJS Starter Kit](https://github.com/latreon/nest-starter-kit), built with [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Features

- Comprehensive documentation for the NestJS Starter Kit
- Interactive examples and code blocks
- Mobile-responsive design
- Dark mode support
- Full-text search

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nest-starter-kit-doc.git
cd nest-starter-kit-doc

# Install dependencies
npm install
```

### Local Development

```bash
# Start the development server
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
# Build the static site
npm run build
```

This command generates static content into the `build` directory and can be served using any static hosting service.

### Deployment

```bash
# Serve the built website locally
npm run serve
```

## Project Structure

```
nest-starter-kit-doc/
├── docs/               # Documentation markdown files
│   ├── introduction.md # Root documentation page
│   └── ...
├── src/
│   ├── css/            # Global CSS customizations
│   └── pages/          # Custom React pages
├── static/             # Static assets like images
├── docusaurus.config.js # Main configuration
├── sidebars.js         # Sidebar configuration
└── package.json        # Dependencies and scripts
```

## Contributing

Contributions are welcome! If you'd like to help improve the documentation:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-improvement`)
3. Commit your changes (`git commit -m 'Add some amazing improvement'`)
4. Push to the branch (`git push origin feature/amazing-improvement`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Related Projects

- [NestJS Starter Kit](https://github.com/latreon/nest-starter-kit) - The main project this documentation covers 