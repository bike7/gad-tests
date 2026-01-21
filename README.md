# Tests for GAD application

## GAD Application

Repository: https://github.com/jaktestowac/gad-gui-api-demo
Follow instructions in app README

## Requirements

Link to requirements:
Part 1: https://jaktestowac.pl/lesson/pw2sb01l02/
Part 2: https://jaktestowac.pl/lesson/pw3sb01l01/

## Design Decisions

Key architectural choices:

- **Code Quality Tools**: ESLint, Prettier and Husky for automated code standards and formatting
- **Configuration Management**: dotenv for secure environment-specific configs (API keys, passwords)
- **Test Patterns**: Page Object Model (POM) for UI tests, Arrange-Act-Assert (AAA) for test structure, Composition for modular components
- **Test Data**: Faker library for realistic, randomized test data generation
- **Page Object Methods**: Methods return page objects for improved test flow and readability

See [DECISION_LOG.md](DECISION_LOG.md) for detailed rationale.

## Prepare

### Local recommended tools:

- VS Code
- Git
- Node.js (version >16)

### Installation and setup

- (optional) install VSC recommended plugins
- install dependencies: `npm install`
- setup Playwright with: `npx playwright install --with-deps chromium`
- setup husky with: `npx husky`
- copy application main URL as value of `BASE_URL` variable in `.env` file

## Use

Run all tests:

```
npx playwright test
```

Run all tests with tag:

```
npx playwright test --grep "@smoke"
```

Run a single test 20 times:

```
npx playwright test -g 'Should delete a comment with a logged user @GAD-R09-04' --repeat-each 20
```

For more usage cases look in `package.json` scripts section.


## Workflows

This project includes GitHub Actions workflows for continuous testing:

### 1. Playwright GAD tests - docker image

**File**: `.github/workflows/gad-tests-docker.yml`

Runs Playwright tests against the GAD application using a Docker container.

- **Trigger**: Manual workflow dispatch
- **Environment**: Ubuntu latest with GAD Docker service
- **Docker Image**: `jaktestowac/gad:latest` (exposed on port 3000)
- **Features**:
  - Node.js v22 setup
  - Caching for node_modules and Playwright binaries
  - Health checks for GAD API endpoints
  - Full test suite execution
  - JUnit test report generation
- **Secrets Required**: `USER_EMAIL`, `USER_PASSWORD`
- **Variables Required**: `BASE_URL`

### 2. Playwright GAD tests - clone GAD repo via git

**File**: `.github/workflows/gad-tests-clone-app-repo.yml`

Runs Playwright tests by cloning and starting the GAD application from its GitHub repository.

- **Trigger**: Manual workflow dispatch
- **Environment**: Ubuntu latest with locally started GAD application
- **Features**:
  - Clones GAD application repository
  - Installs dependencies and starts the app on port 3000
  - Health checks for GAD API endpoints
  - Chromium-only test execution
  - JUnit test report generation
- **Secrets Required**: `USER_EMAIL`, `USER_PASSWORD`
- **Variables Required**: `BASE_URL`

Both workflows include health checks, dependency caching for faster runs, and automated test reporting.
