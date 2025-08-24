# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@worktionary/workfriends - A simple TypeScript utility library that determines if email addresses belong to work colleagues by checking if they share the same domain.

## Development Commands

- **Build**: `npm run build` - Compiles TypeScript to JavaScript in dist/ directory
- **Test**: `npm test` - Runs Jest test suite
- **Run specific test**: `npm test -- index.test.ts` or `npm test -- --testNamePattern="pattern"`

## Architecture

This is a minimal TypeScript library with a single exported function:

- **src/index.ts**: Contains the main `areWorkFriends` function that:

  - Accepts an array of email addresses and optional known domain(s)
  - Returns true if all emails are from the same domain (auto-detect mode) or match known domain(s)
  - Handles case-insensitive domain comparisons

- **src/index.test.ts**: Jest test suite covering auto-detect mode, single domain, and multiple domain scenarios

## TypeScript Configuration

- Strict mode enabled with additional strict checks (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- CommonJS module output for Node.js compatibility
- Source maps and declarations generated for debugging and type support
- Separate `tsconfig.build.json` for production builds (excludes test files)
