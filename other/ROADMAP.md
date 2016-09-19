# Project Roadmap

## Want to do

- Remove unused variables/exports/arguments (I think that this should be the responsibility of `babel-plugin-minify-dead-code-elimination`). Need to report an issue/file a PR there.
- Remove comments associated with removed functions
- Handle side-effects (for example: `if (node = node.parentNode) {/* uncovered */}` should result in `node = node.parentNode`) in:
  - [x] IfStatements
  - [ ] ConditionalExpressions
  - [ ] loops (while, do, for)
  - [ ] elsewhere?

## Might do

- Remove all comments?

## Wont do
