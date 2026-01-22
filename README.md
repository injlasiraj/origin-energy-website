# Origin Energy - Playwright Tests

Automated UI tests for the Origin Energy pricing website using Playwright with TypeScript.

## Test Scenario

The test performs the following steps:

1. Navigate to the pricing page
2. Search for an address
3. Select the address from the suggestion list
4. Verify that plans are displayed
5. Uncheck the Electricity checkbox
6. Verify that plans are still displayed
7. Click on the plan link in the Plan BPID/EFS column
8. Verify that the plan details page opens in a new tab
9. Download the plan PDF
10. Assert that the PDF content confirms it is a Gas plan

## Project Structure

```
origin-energy-test/
├── tests/                 # Playwright test specs
├── pages/                 # Page Object Model classes
├── testdata/              # Test data (addresses.json)
├── playwright.config.ts   # Playwright configuration
├── Dockerfile             # Docker configuration
└── docker-compose.yml     # Docker Compose configuration
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
