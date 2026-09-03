---
id: FBK-20260903-XCTYG-9
---

# Feedback / Observation: Hierarchical Identity Is Insufficient

## Interaction Context

Who interacted: human project authority.

Artifact/build/commit: review of `EVD-20260903-XCTYG-8` at commit `8e37d250af3658c49601bcd6a26b5b5d0e502928`, while cycle `CYC-20260903-XCTYG-7` was in Evaluate.

Scenario: human reviewed the initial architecture evidence map and provided one additional input before cycle acceptance.

## Observations

The human stated that hierarchical identity is insufficient.

Ariadne has repeatedly hit that limitation: graph-based data had to be wrangled into a strict hierarchy.

The human stated that SimplyStore shows what they think is the better model.

## Interpretation

This feedback materially changes the evidence-map emphasis.

Hierarchy should not be treated as a likely primitive by default. It should be treated as one useful projection or containment relation that must coexist with graph-shaped identity and relationships.

Ariadne remains useful historical evidence, but this feedback weakens the interpretation that Ariadne's stable path hierarchy should be copied into Airadne's semantic core. The more fundamental candidate property is stable identity with multiple navigable relationship projections, including but not limited to hierarchy.

SimplyStore gains weight as evidence for graph-shaped data, link-oriented representation, and derived indexes/views over a strict tree.

## Upstream Impact

- [x] Understanding remains valid
- [ ] Understanding should be changed/superseded in a new commit
- [x] Request remains valid
- [ ] Request should be changed in a new commit
- [ ] Design should be changed in a new commit
- [x] New risk discovered
- [ ] More interaction needed

New risk: choosing hierarchy as a foundational identity model may prematurely close over graph-shaped domains and force later complexity into workaround layers.

## Resulting Work

Revise `EVD-20260903-XCTYG-8` to:

- distinguish stable identity from hierarchy;
- treat hierarchy as a projection/relation rather than the default identity model;
- add graph-first modeling as a stronger candidate direction;
- record Ariadne's hierarchy limits as counterevidence;
- increase the recommended experiment's emphasis on cross-cutting graph relationships.
