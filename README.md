# Origin Energy Pricing Tests

Automated end-to-end UI tests for the Origin Energy pricing website using Playwright with TypeScript. This project validates the pricing page functionality including address search, plan filtering, and PDF verification.

## Features

- Playwright with TypeScript for reliable browser automation
- Page Object Model (POM) design pattern for maintainable tests
- PDF content verification using pdf-parse
- Docker support for containerized test execution
- HTML test reports with screenshots and traces

## Test Coverage

The test suite validates the following user journey:

1. Navigate to the Origin Energy pricing page
2. Search for an address and select from suggestions
3. Verify energy plans are displayed
4. Filter plans by unchecking Electricity (Gas only)
5. Open plan details in a new tab via BPID/EFS link
6. Download and verify the plan PDF contains expected content

## Project Structure

```
origin-energy-test/
├── tests/                 # Playwright test specifications
│   └── pricing.spec.ts    # Pricing page test suite
├── pages/                 # Page Object Model classes
│   ├── BasePage.ts        # Base page with common methods
│   └── PricingPage.ts     # Pricing page interactions
├── testdata/              # Test data files
│   └── addresses.json     # Test addresses and expected values
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── Dockerfile             # Docker image definition
└── docker-compose.yml     # Docker Compose setup
```

## Option 1: Run Locally

### Prerequisites

- Node.js v18+ ([Download](https://nodejs.org/))
- npm v9+ (included with Node.js)

### macOS

```bash
# Install Node.js using Homebrew (if not installed)
brew install node

# Navigate to project directory
cd origin-energy-test

# Install dependencies
npm install

# Install Playwright browser
npx playwright install chromium

# Run tests (headed mode - browser visible)
npm run test:headed

# Run tests (headless mode)
npm test
```

### Windows

```powershell
# Install Node.js from https://nodejs.org/ or using winget
winget install OpenJS.NodeJS.LTS

# Navigate to project directory
cd origin-energy-test

# Install dependencies
npm install

# Install Playwright browser
npx playwright install chromium

# Run tests (headed mode - browser visible)
npm run test:headed

# Run tests (headless mode)
npm test
```

### Additional Commands

```bash
# Debug mode
npm run test:debug

# UI mode (interactive test runner)
npm run test:ui

# View HTML report
npm run test:report
```

## Option 2: Run with Docker

### Prerequisites

- Docker Desktop ([macOS](https://docs.docker.com/desktop/install/mac-install/) | [Windows](https://docs.docker.com/desktop/install/windows-install/))

### macOS

```bash
# Navigate to project directory
cd origin-energy-test

# Build and run tests
docker compose up --build

# Run tests only (after initial build)
docker compose up

# Clean up containers
docker compose down
```

### Windows

```powershell
# Navigate to project directory
cd origin-energy-test

# Build and run tests
docker compose up --build

# Run tests only (after initial build)
docker compose up

# Clean up containers
docker compose down
```

## Test Reports

After test execution, reports are available in:

| Location | Description |
|----------|-------------|
| `playwright-report/` | HTML report (open `index.html` in browser) |
| `test-results/` | Screenshots, videos, and traces |
| `downloads/` | Downloaded PDF files |

View the HTML report:
```bash
npm run test:report
```
