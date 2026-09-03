---
id: IMP-20260903-XCTYG-26
---

# Implementation: Compositional Object-Space Kernel

## Role

This implementation refactors the graph-first object-space baseline into smaller graph primitives while preserving the publication behavior API.

## Cycle

`CYC-20260903-XCTYG-24`

## Design Implemented

`DES-20260903-XCTYG-21`

## Implementation Locations

- `src/graph-primitives.cjs`
- `src/graph-object-space.cjs`
- `test/graph-primitives.test.cjs`

## What Changed

Added `src/graph-primitives.cjs` with domain-neutral primitives:

- `createObjectRegistry`: stable object lookup, type indexing, duplicate rejection.
- `createRelationFacts`: relation storage, endpoint validation, mutation versioning.
- `createRelationIndex`: indexed edge/source/target lookup over relation facts.
- `findPath`: generic typed path traversal.
- `findAncestors`: generic reverse traversal.
- `containmentPath`, `containmentAncestors`, and `buildContainmentTree`: named containment projection helpers that explicitly report stable ID identity.

Refactored `ObjectSpace` in `src/graph-object-space.cjs` into a facade that composes the primitives and forwards the existing API used by publication-domain rules.

Added neutral primitive tests in `test/graph-primitives.test.cjs` so object registry, relation facts, relation indexing, traversal, and containment projection can be verified without loading the publication fixture.

## Behavior Preserved

The public API from `createGraphFirstPublication(data)` remains unchanged:

- query visible pages;
- explain visibility;
- resolve referenced assets;
- build navigation projection;
- list pages by topic;
- create and edit drafts;
- add asset references;
- publish valid pages and reject invalid pages;
- explain authorization;
- select behavior by precedence.

## Important Implementation Decisions

`ObjectSpace` was kept as a compatibility facade for this cycle. This keeps existing publication rules and tests stable while still moving object storage, relation storage, relation indexing, and traversal algorithms into primitives.

Relation indexing is lazy and versioned. `createRelationFacts` owns mutation versioning; `createRelationIndex` rebuilds only when relation facts change. This keeps mutation knowledge out of the publication layer without requiring a larger event or command system.

Containment projection is separate from generic traversal. Generic traversal knows only relation type and path shape; containment helpers are the first layer that says `contains` has projection meaning.

Publication-domain rules still live in `src/graph-object-space.cjs`. Authorization, workspace scope, validation, behavior precedence, and explanation assembly were intentionally not moved into the graph primitives.

## AI-First Abstraction Result

The implementation adds vocabulary and code volume, but makes the primitive contracts more explicit and independently testable. This follows the accepted AI-first caveat: extra vocabulary is acceptable only when it reduces hidden semantics and improves verification.

## Known Compromises

- `src/graph-object-space.cjs` still contains all publication-domain rules and remains larger than the conventional baseline.
- `ObjectSpace` still exists as a facade, so the project has not yet tested whether publication rules should compose primitives directly.
- Relation facts still use the existing fixture edge shape rather than a normalized fact model.
- Explanation traces remain assembled by publication rules; traversal primitives only provide path records.

## Verification

Verification is recorded in `EVD-20260903-XCTYG-25`.
