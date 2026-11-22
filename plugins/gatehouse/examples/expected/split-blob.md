Verdict: INSTALL WITH EDITS
Must report: G-TEXT-03
Must not report: G-INJ-01, G-INJ-02, G-INJ-03, G-EXEC-01, G-EXEC-02, G-EXEC-03, G-EXEC-04, G-PERM-01, G-PERM-02, G-NET-01
Canary: none
Audit root: the generated copy that `node examples/make-fixtures.mjs` writes next to the hidden-text copy (target type: skill; 1 file; coverage complete). It is not committed as a folder: the committed form of this fixture is the generator.
Reason per ID:
- G-TEXT-03: SKILL.md lines 10 to 17 are eight lines of 30 characters from the base64 alphabet. No single run reaches the 80-character S-BLOB threshold, so only S-BLOB-SPLIT (24 or more characters, 5 or more hits in one file) catches them. Edit-level (a split run is not a blob of 80 or more). Never decode.
Notes: the lines decode, joined, to a harmless sentence; a run that decodes is still not decoded.
Status: prediction written with the rule, not a measurement.
