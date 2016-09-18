# Project Roadmap

## Want to do

- Remove unused variables/exports/arguments
- Remove comments associated with removed functions
- Handle side-effects (for example: `if (node = node.parentNode) {/* uncovered */}` should result in `node = node.parentNode`)
- Remove all code after an early return

## Might do

- Remove all comments?

## Wont do
