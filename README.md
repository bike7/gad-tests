# Tests for GAD application

## GAD Application

Repository: https://github.com/jaktestowac/gad-gui-api-demo
Follow instructions in app README

## Requirements

Link to requirements:
Part 1: https://jaktestowac.pl/lesson/pw2sb01l02/
Part 2: https://jaktestowac.pl/lesson/pw3sb01l01/

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
