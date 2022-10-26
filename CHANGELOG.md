## Changelog Versions
- [Changelog Versions](#changelog-versions)
- [Latest v1.1.1](#latest-v111)
  - [Added / New](#added--new)
  - [Breaking](#breaking)
- [v1.0.10](#v1010)
  - [Added / New](#added--new-1)
  - [Deprecated](#deprecated)
- [v1.0.9](#v109)
- [v1.0.7](#v107)

## Latest v1.1.1
### Added / New
- Rewritten code for easy to use
- Reworked `Context`
- Reworked `Lexer`
- Reworked `Parser`
- Added `Evaluator`
- Added `Runtime`
- Fixed `operator` type breaks punctuations
- Readded some utility calls
- Added `$async`, `$wait`, `$safejs`, `$if`
### Breaking
- Removed `FNHandler`
- Removed `Script`
- Removed `Nodes`
## v1.0.10
### Added / New
- Added `Path`, `FileSystem` class
- New features `$eval`
- getter method `argLength`, a replacement for `getArgLength`
### Deprecated
- Function `getArgLength` deprecated, use `argLength` instead
## v1.0.9
- Added `OS`, `Process`, `ObjectInteract` class
- New features `$throw`, `$new`, `$tryAndCatch`, `$let`, `$get`
## v1.0.7
- Added `CHANGELOG.md`
- Added Environment Manager
- Changed `ReadyEnvironments` to `Modules`
- Removed `BuiltInEnvironment` class
- Added `Arithmetics` and `Utility` class