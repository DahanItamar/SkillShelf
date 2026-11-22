# Changelog

## 1.3.0
- Fixed the rule count in plugin metadata (40, not 43).
- Build mode now says which reference files to read for what you are writing, which code patterns to grep for, and what to do with an unknown stack or no UI code.
- Missing `craft` / `accessibility` skills no longer swallow findings; they are reported as out of scope in one line.
- R-FORM-01 states its in-flight exception up front; R-STATE-02 points to R-STATE-06; R-STATE-07 and R-LAW-07 now have checks that run against code.
- Trigger description no longer fires on vague phrases like "this form is annoying".
- Added `examples/` with seeded buggy components and expected findings.

## 1.2.0 and earlier
- Rules capped at 40; retired R-STATE-03 and R-STATE-05 merged into R-STATE-06 and R-STATE-04. Earlier history was not recorded.
