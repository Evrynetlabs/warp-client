module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
  },
  extends: [
    "plugin:react/recommended",
    "eslint:recommended",
    "prettier/react",
  ],
  plugins: [
    "prettier"
  ],
  rules: {
    "prettier/prettier": "error",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2018,
    sourceType: "module"
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};