# Diff examples

- `add-refund.diff`: a diff with a new function, a new caller of an existing fake-success function, and deleted error handling. Expected result: `../expected/add-refund.md`.
- `refund.py`: an untracked-file example. Imagine `git status` lists it as a new file that was never added: `git diff HEAD` shows nothing for it, so Truthpath also lists `git ls-files --others --exclude-standard` and treats every line of `refund.py` as added (no diff header). Expected: one confirmed TP-02 finding at `refund.py:12` (blast radius: money), and the scope line ends with `(1 untracked file treated as new)`.
