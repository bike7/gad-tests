# Tests for GAD application

## GAD Application

Repository: https://github.com/jaktestowac/gad-gui-api-demo
Follow instructions in app README

## Requirements

Link to requirements: https://jaktestowac.pl/lesson/pw2sb01l02/

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

For more usage cases look in `package.json` scripts section.
