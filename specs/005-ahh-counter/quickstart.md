# Quickstart: Setting up the Testing Environment

This document provides the steps to set up the testing environment for this project, which is a prerequisite for any feature development.

## 1. Install Dependencies

The following development dependencies need to be added to `package.json`:

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

## 2. Configure Jest

Create a `jest.config.js` file in the root of the project with the following content:

```javascript
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle CSS imports (if you're using them)
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};
```

Create a `jest.setup.js` file in the root of the project with the following content:

```javascript
import '@testing-library/jest-dom';
```

## 3. Configure Babel

Create a `.babelrc` file in the root of the project:
```json
{
  "presets": ["next/babel"]
}
```

## 4. Add Test Script to package.json

Update the `scripts` section of `package.json` to include a `test` script:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest --watch"
},
```

After these steps are completed, the project will be ready for Test-Driven Development.
