---
id: FBK-20260903-XCTYG-23
---

# Feedback: Programming For Wizards Has A Human-Consumption Caveat

## Context

Human review of `SRC-20260903-XCTYG-20`, `UND-20260903-XCTYG-22`, and `DES-20260903-XCTYG-21` during cycle `CYC-20260903-XCTYG-19`.

## Human Feedback

_Programming for Wizards_ was written for human consumption and already incorporates the issue of humans having to learn too many languages. Therefore some of its advice is not directly applicable to Airadne's AI-first test.

## Interpretation

The book remains relevant source material for abstraction, language, boundary, and dependency thinking, but it must not be imported as an unmodified human-developer design culture.

The Airadne project should distinguish:

- advice about finding real abstraction pressure, which remains strongly relevant;
- advice about minimizing human learning burden, which is relevant but not decisive;
- advice about avoiding too many little languages, which must be reinterpreted for AI context size, explicit semantics, handover, and verification.

In an AI-first test, a new language or primitive may be acceptable even when it would be too costly for a human team, if the semantic model is smaller, more explicit, easier to load into context, and easier to verify.

The counter-risk remains: extra languages may still harm AI agents if their semantics are implicit, scattered, poorly tested, or require large hidden background knowledge.

## Upstream Impact

`UND-20260903-XCTYG-22` should be revised so "new words must earn their cost" does not mean "minimize vocabulary as humans would." It should mean "minimize total reasoning burden for the intended maintainer, including AI agents."

`DES-20260903-XCTYG-21` should be revised so the compositional design is allowed to introduce primitives even when they increase human-visible vocabulary, provided the primitives improve explicitness, context fit, and falsifiability for the AI-first experiment.

## Resulting Work

- Revise `UND-20260903-XCTYG-22` with an AI-first caveat.
- Revise `DES-20260903-XCTYG-21` with an AI-first vocabulary and evaluation caveat.
