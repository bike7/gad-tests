# Tests for GAD application

Modern Test automation framework for UI and API testing of the GAD application using Playwright and TypeScript. The framework follows Page Object Model and Arrange–Act–Assert patterns, uses fixtures and method chaining for readability. It generates realistic test data with Faker, enforces high code quality through ESLint, Prettier, Husky and Dotenv and includes two GitHub Actions CI/CD pipelines. One pipeline provisions the application under test using a prebuilt Docker image including all required services while the second pipeline clones the application source repository, builds it and starts the application as part of the CI workflow.

[![Docker CI](https://github.com/bike7/gad-tests/actions/workflows/gad-tests-docker.yml/badge.svg)](https://github.com/bike7/gad-tests/actions/workflows/gad-tests-docker.yml)
[![Git-based CI](https://github.com/bike7/gad-tests/actions/workflows/gad-tests-clone-app-repo.yml/badge.svg)](https://github.com/bike7/gad-tests/actions/workflows/gad-tests-clone-app-repo.yml)

Link to the report: 🎭[Playwright Report](https://bike7.github.io/gad-tests/)


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

See [DECISION_LOG.md](DECISION_LOG.md) and [CODING_STANDARDS.md](CODING_STANDARDS.md) for detailed info.

## Testing Framework

This project uses **Playwright** as the primary testing framework, providing comprehensive test coverage for both UI and API interactions.

### Test Types

#### 1. UI Tests (`tests/ui/`)

**Smoke Tests** - Quick validation of critical functionality:

- Page title verification (Home, Articles, Comments pages)
- Main menu navigation functionality
- Basic accessibility of key pages

**Integration Tests** - Feature-level testing:

- **Authentication**: User login with correct/incorrect credentials, user registration with validation
- **Articles Management**: Article creation with field validation (title length limits, required fields), article display and access
- **Comments Management**: Comment creation and updates, comment body validation
- **Search Functionality**: Article search component behavior

**End-to-End Tests** - Complete user workflows:

- Full article lifecycle (create → verify → delete)
- Full comment lifecycle (create → verify → delete)
- Multiple comments on a single article
- Cross-feature integration scenarios

#### 2. API Tests (`tests/api/`)

**Smoke Tests** - API endpoint availability and basic responses:

- Health check endpoint (`/api/health`)
- Articles endpoint response validation
- Comments endpoint response validation
- Response structure and status code verification

**CRUD Operations** - Comprehensive API testing:

- **Articles API** (`@GAD-R08-01`, `@GAD-R09-01`, `@GAD-R09-03`, `@GAD-R10-01`, `@GAD-R10-03`):
  - Create articles (with/without authentication)
  - Read articles with proper field validation
  - Update articles (full and partial modifications)
  - Delete articles (authorized/unauthorized)
- **Comments API** (`@GAD-R08-02`, `@GAD-R09-02`, `@GAD-R09-04`, `@GAD-R10-02`):
  - Create comments (with/without authentication)
  - Read comments with proper field validation
  - Update comments (full and partial modifications)
  - Delete comments (authorized/unauthorized)

### Test Coverage Features

- **Authentication & Authorization**: Login, registration, access control for CRUD operations
- **Articles**: Creation, validation (title/body limits), viewing, editing, deletion
- **Comments**: Creation, validation, viewing, editing, deletion, multiple comments per article
- **Navigation**: Menu functionality, page routing, breadcrumb navigation
- **Search**: Article search and filtering
- **Validation**: Input field validation, error handling, boundary testing
- **Negative Testing**: Invalid credentials, missing required fields, unauthorized operations

### Test Organization

- Tests tagged with requirement IDs (e.g., `@GAD-R04-01`)
- Category tags: `@smoke`, `@logged`, `@predefined_data`, `@negative`, `@crud`
- Feature tags: `@articles`, `@comments`, `@create`, `@update`, `@delete`
- Organized by test type: smoke, integration, end-to-end
- Separate API and UI test suites

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

## CI workflows

This project includes two GitHub Actions workflows for continuous testing:

### 1. Playwright GAD tests - docker image

**File**: `.github/workflows/gad-tests-docker.yml`

[![Docker CI](https://github.com/bike7/gad-tests/actions/workflows/gad-tests-docker.yml/badge.svg)](
https://github.com/bike7/gad-tests/actions/workflows/gad-tests-docker.yml
)

Runs Playwright end-to-end tests against a GAD application started as a Docker service, providing a stable and isolated test environment.

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

[![Git-based CI](https://github.com/bike7/gad-tests/actions/workflows/gad-tests-clone-app-repo.yml/badge.svg)](
https://github.com/bike7/gad-tests/actions/workflows/gad-tests-clone-app-repo.yml
)

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
