---
id: DES-20260903-XCTYG-21
---

# Design: Compositional Object-Space Kernel

## Role

This design proposes the next graph-focused implementation step for cycle `CYC-20260903-XCTYG-19`: decompose the current monolithic `ObjectSpace` into smaller primitives whose boundaries can be independently inspected and tested.

## Why This Exists

The accepted graph-first baseline proves behavior parity and useful trace shape, but not the fuller Airadne idea. The current `ObjectSpace` is one abstraction that bundles storage, indexing, mutation, traversal, and projection concerns.

The goal is to turn that single abstraction into a small graph kernel plus publication-domain rules, without inventing a parser, persistence layer, generated runtime, or generalized query engine.

## Design Inputs

- `DES-20260903-XCTYG-11`: graph-first experiment design and behavior contract.
- `EVD-20260903-XCTYG-17`: graph-first verification evidence.
- `FBK-20260903-XCTYG-18`: ObjectSpace is not yet compositional.
- `UND-20260903-XCTYG-22`: book-derived abstraction method for Airadne.

## Current Behavior To Preserve

The public API returned by `createGraphFirstPublication(data)` should keep satisfying the shared behavior contract:

- list visible pages in a workspace;
- explain visibility;
- resolve referenced assets;
- build containment-based navigation projection without path identity;
- list pages by topic;
- create and edit draft pages;
- add asset references;
- publish valid pages and reject invalid pages;
- explain authorization failures;
- select behavior by deterministic precedence.

## Proposed Boundary Model

### Object Registry

Owns stable object lookup and object type membership.

Allowed knowledge:

- object IDs;
- object records;
- object `type` field;
- duplicate ID rejection.

Forbidden knowledge:

- relation types;
- containment;
- authorization;
- workspace;
- behavior precedence.

Candidate API:

```js
const registry = createObjectRegistry(objects);
registry.get(id, expectedType);
registry.all(type);
registry.add(object);
```

### Relation Facts

Owns relation fact storage and basic reference validation.

Allowed knowledge:

- relation records;
- relation `type`, `from`, and optional `to`;
- whether `from` and `to` object IDs exist.

Forbidden knowledge:

- which relation types are semantic;
- how a relation participates in authorization, behavior, or projection;
- traversal strategy.

Candidate API:

```js
const relations = createRelationFacts(registry, relationRecords);
relations.all(type);
relations.add(edge);
relations.has(type, from, to);
```

### Relation Index

Owns efficient lookup by relation type, source, and target.

Allowed knowledge:

- index keys;
- relation records;
- source/target lookup.

Forbidden knowledge:

- object fields other than IDs used by relation records;
- domain rules;
- path meaning.

Candidate API:

```js
const index = createRelationIndex(relations);
index.edges(type, { from, to });
index.targets(type, from);
index.sources(type, to);
```

This boundary is useful only if it can be tested against the same relation facts without publication-domain fixtures.

### Graph Traversal

Owns generic path finding over a relation index.

Allowed knowledge:

- relation type to traverse;
- start ID;
- target ID or direction;
- path records.

Forbidden knowledge:

- that `contains` means navigation;
- that `variantOf` affects authorization;
- object type filtering.

Candidate API:

```js
findPath(index, { relationType, from, to });
findAncestors(index, { relationType, of });
```

### Projection Rules

Own named projection semantics over graph traversal.

Allowed knowledge:

- "containment projection" means following `contains`;
- projected navigation filters object types;
- path identity is explicitly not object identity.

Forbidden knowledge:

- authorization grants;
- publication validation;
- behavior precedence beyond source discovery.

Candidate API:

```js
containmentPath(graph, scopeId, objectId);
containmentAncestors(graph, objectId);
buildContainmentTree(graph, rootId, { includeTypes });
```

Projection rules are the first place where relation meaning enters the graph layer. Keeping this separate protects the kernel from pretending that all traversal has the same semantics.

### Publication Rules

Own the current domain behavior: visibility, authorization, validation, mutation, workspace scope, and behavior selection.

Allowed knowledge:

- publication fixture object types;
- relation meanings such as `inWorkspace`, `grants`, `usesBehavior`, `taggedWith`, and `variantOf`;
- experiment-specific behavior precedence;
- explanation record shape.

Forbidden knowledge:

- index implementation;
- relation-storage implementation;
- mutation mechanics beyond the primitive APIs.

Publication rules may compose graph primitives directly or through a thin `ObjectSpace` facade.

## ObjectSpace Facade Decision

Keep `ObjectSpace` as a facade for this implementation cycle, but make it boring:

- construct the registry, relation facts, relation index, and traversal/projection helpers;
- expose only the API already used by publication rules;
- contain little or no original algorithmic logic.

If the facade remains a magnet for domain rules, that is negative evidence and should be recorded.

## Test Plan

Preserve existing contract coverage:

```text
npm test
```

Add primitive-level tests that can fail independently of publication behavior:

- object registry rejects duplicate IDs and type mismatches;
- relation facts reject unknown object references;
- relation index returns edges, sources, and targets without domain knowledge;
- graph traversal finds typed paths and ancestors on a small neutral fixture;
- containment projection builds a tree and records stable ID identity separately from projection relation.

The primitive tests should use a deliberately smaller neutral graph where possible, not only the publication fixture.

## Expected Implementation Shape

Likely files:

- `src/graph-primitives.cjs`: registry, relation facts, relation index, generic traversal, maybe projection helpers if still small.
- `src/graph-object-space.cjs`: facade plus publication API wiring, or publication rules over primitives.
- `test/graph-primitives.test.cjs`: primitive boundary tests.
- Existing publication tests remain the behavior contract.

This file split is provisional. The real criterion is whether each boundary has a clear bargain and independent tests.

## Falsification Checks

The decomposition is weak or wrong if:

- primitive names are harder to learn than the original class;
- tests can only verify primitives through publication behavior;
- domain words leak into relation indexing or generic traversal;
- `ObjectSpace` still contains substantial algorithmic logic after extraction;
- explanation traces become less explicit;
- relation semantics are hidden behind generic traversal cleverness;
- line count decreases but conceptual count increases.

## Evaluation Evidence To Record After Implementation

If this design is accepted and implemented, record evidence answering:

- Which responsibilities moved out of `ObjectSpace`?
- Which primitives are independently testable?
- What source must an unfamiliar AI inspect to change projection, authorization, behavior selection, or relation indexing?
- Did explanation quality improve, stay the same, or degrade?
- Did the decomposition reveal that a different boundary is needed?
- Would ordinary explicit code still be simpler for this slice?

## Material Assumptions

- The current fixture shape remains adequate for this decomposition test.
- Plain JavaScript data is still the right medium for the next step.
- It is acceptable for the implementation to add some lines if the conceptual boundaries become more falsifiable.
- The first useful compositional proof is not a final graph engine; it is a graph layer whose parts can be separately understood.

## Confidence

Medium. The pressure points are visible in current code and the proposed boundaries follow the book-derived method, but the names and exact split are design choices that should be reviewed before implementation.
