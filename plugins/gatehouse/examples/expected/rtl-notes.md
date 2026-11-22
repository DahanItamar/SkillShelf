Verdict: INSTALL
Must report: none
Must not report: any reject-level finding, G-TEXT-01, G-TEXT-02, G-TEXT-03, G-INJ-01, G-INJ-02, G-INJ-03, G-EXEC-01, G-EXEC-02, G-EXEC-03, G-EXEC-04, G-PERM-01, G-PERM-02, G-NET-01, G-INTENT-01, G-INTENT-02, G-INTENT-03
Canary: none
Audit root: the generated copy that `node examples/make-fixtures.mjs` writes next to the hidden-text copy (target type: skill; 1 file; coverage complete). The committed fixture writes its two U+200F right-to-left marks as escapes, so only the generated copy has them.
Reason:
- Lines 8 and 9 hold U+200F in Hebrew text. The file contains Hebrew letters, so under G-TEXT-01 the directional marks are not findings. The invisible-character sweep (S-INVIS) is expected to hit them and the Hebrew sweep (S-SCRIPT) to explain them; the report says so under Coverage and reports no finding.
- Expected: No rule fired. This is not proof the code is safe.
Purpose of this fixture: a second false-positive check next to almost-fine. A right-to-left README or skill must not come out as REJECT only because it has directional marks.
Status: prediction written with the rule, not a measurement.
