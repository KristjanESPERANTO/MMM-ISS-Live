# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.3.0](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.2.0...v2.3.0) (2026-03-07)

Thanks to @ChrisF1976 the module is working again. Thanks!

### Added

* add changelog config and release script ([1d970d7](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/1d970d7307f38d9f328a343f992763b30e7996d3))


### Fixed

* convert YouTube watch URLs to embed format and improve stream parameters ([7a6131d](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/7a6131d55b02809a7aab670623438bfe67d8f9ac)) (#8)
* strip Electron user agent and set referrer to fix YouTube Error 153 in webview ([242db11](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/242db114630529efcc1349ec4571f5753bf36e25))


### Documentation

* update README to clarify module status ([e6b8b6f](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/e6b8b6f682e0db3a85a2f68576693bde343876f2))
* update README to reflect working module status and clean up URLs ([41a0fd9](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/41a0fd9e5b35362d1829d2639a3a4a1e39a8efcf))


### Chores

* add demo script ([e1e8ba0](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/e1e8ba06cafb67f09a8713419e6d64b66e10e1db))
* change runner from ubuntu-latest to ubuntu-slim in automated tests workflow ([809ed85](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/809ed85800be65e218e7a7a4cc5f9aad32421eb8))
* replace husky with simple-git-hooks ([a28c68a](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/a28c68a40fe10ebbcd5761cb1afb56aa3bbc51ee))
* update actions/checkout to v6 in automated tests workflow ([249cc1b](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/249cc1bc7dcfe9bfa2fe281ccba08dbfa01121f3))
* update devDependencies ([12549fe](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/12549fe83014502928a99e6955e834285f8eb3d6))
* update devDependencies ([88e8339](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/88e8339861fdfb53b785872b1d20d26fc2e65764))
* update eslint config ([ef21b66](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/ef21b664bab0ca2c5c22c294d98b918c0ff3a182))


### Code Refactoring

* extract convertYouTubeUrl helper and fix stream URL issues ([8a02e25](https://github.com/KristjanESPERANTO/MMM-ISS-Live/commit/8a02e251cffdaf5618bac44e8cf3447f0165150f))

## [2.2.0](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.1.0...v2.2.0) - 2025-10-29

### Added

- feat: add Docker/browser support with YouTube error 153 fix

### Changed

- chore: add 'playsinline' and 'webpreferences' to cspell configuration
- chore: update actions/setup-node to v6 in automated tests workflow
- chore: update devDependencies

## [2.1.0](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.0.8...v2.1.0) - 2025-10.04

### Added

- feat: enhance MMM-ISS-Live module with webview support and updated default video URL

### Changed

- chore: update actions/checkout to v5 in automated tests workflow
- chore: update actions/setup-node to v5 in automated tests workflow
- chore: update devDependencies

## [2.0.8](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.0.7...v2.0.8) - 2025-06-23

### Changed

- chore: add `"type": "module"` to `package.json`
- chore: update devDependencies

## [2.0.7](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.0.6...v2.0.7) - 2025-05-17

### Changed

- chore: update devDependencies
- chore: review linter setup

## [2.0.6](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.0.5...v2.0.6) - 2025-04-21

### Changed

- chore: update devDependencies
- chore: update ESLint configuration to use new import plugin structure
- docs: adapt 'npm install' description for consistency with other modules

## [2.0.5](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.0.4...v2.0.5) - 2025-03-18

### Added

- chore: Add CHANGELOG.md

### Fixed

- fix: Replace not working default stream by working one

### Changed

- chore: Update devDependencies
- chore: Update eslint-plugin-package-json config

## [2.0.4](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.0.3...v2.0.4) - 2025-02-27

### Added

- docs: add known issues section regarding ad blockers
- chore: Add lint-staged, husky and eslint-plugin-package-json
- chore: Add workflow

### Changed

- chore: Update devDependencies
- chore: Replace eslint-plugin-import by eslint-plugin-import-x

### Changed

- chore: Update devDependencies

## [2.0.3](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.0.2...v2.0.3) - 2025-01-21

### Changed

- Update default URL to a new stream
- chore: Optimize ESLint calls

## [2.0.2](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.0.1...v2.0.2) - 2024-12-10

### Added

- chore: Add URL to the MM project
- chore: Add Code of Conduct

### Changed

- chore: Update format with eslint-plugin-package-json
- chore: Update devDependencies

## [2.0.1](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v2.0.0...v2.0.1) - 2024-11-04

### Added

- feature: Add option to change stream
- chore: Add Update und Contributing sections to README
- chore: Add spell check
- chore: Add dependabot

### Changed

- chore: Update devDependencies
- chore: Switch to ESLint flat config
- chore: Switch LICENSE file to markdown
- chore: Rename screenshot files

### Fixed

- Fix typos
- Fix example position in README

## [2.0.0](https://github.com/KristjanESPERANTO/MMM-ISS-Live/compare/v1.0.0...v2.0.0) - 2023-11-22 - First fork version 🚀

### Added

- chore: Add linter
- chore: Add .gitignore
- chore: Add package.json

### Changed

- Review and refactor code
- Update README

### Fixed

- Use working source for steam
