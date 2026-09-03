---
id: FBK-20260903-XCTYG-27
---

# Feedback: Line Count Is Not The Optimization Metric

## Context

Human review of `EVD-20260903-XCTYG-25` and the cycle summary for `CYC-20260903-XCTYG-24`.

## Human Feedback

Line count is not a metric Airadne is optimizing for.

## Interpretation

Line count may still be recorded as lightweight diagnostic evidence about where implementation mass moved, but it must not be treated as a score, target, or acceptance criterion.

For this project, more relevant evaluation questions are:

- are semantics explicit?
- are boundaries independently testable?
- can a fresh AI agent load the relevant model cheaply?
- can behavior be explained causally?
- can a human audit the explanation?
- can wrong pieces be replaced without rewriting the whole system?

The fact that code grows or shrinks is secondary evidence only. It may prompt investigation, but it does not decide success.

## Upstream Impact

`EVD-20260903-XCTYG-25` and `CYC-20260903-XCTYG-24` should be revised so line-count observations are framed as non-optimizing diagnostics rather than caveats with metric weight.

## Resulting Work

- Revise `EVD-20260903-XCTYG-25`.
- Revise `CYC-20260903-XCTYG-24`.
