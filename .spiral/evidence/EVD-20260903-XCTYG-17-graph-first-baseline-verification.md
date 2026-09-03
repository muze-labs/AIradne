---
id: EVD-20260903-XCTYG-17
---

# Verification Evidence: Graph-First Object-Space Baseline

## Claim Being Verified

The graph-first object-space baseline implements representation B from `DES-20260903-XCTYG-11` against the same publication fixture and behavior surface as the conventional baseline.

## Why This Evidence Exists

This evidence supports cycle `CYC-20260903-XCTYG-16` and verifies implementation `IMP-20260903-XCTYG-15`.

The project needs evidence on whether graph-first object-space semantics can provide structured explanations and preserve hierarchy-as-projection while matching the conventional baseline's behavior.

## Implementation Under Test

| Artifact/path/symbol | Commit | Role |
|---|---|---|
| `IMP-20260903-XCTYG-15` | `e47504b459447a9e3ba7508e26db4b12d6b8c51d` | Governed graph-first implementation artifact. |
| `src/graph-object-space.cjs#ObjectSpace` | `e47504b459447a9e3ba7508e26db4b12d6b8c51d` | Object/relation index and traversal layer. |
| `src/graph-object-space.cjs#createGraphFirstPublication` | `e47504b459447a9e3ba7508e26db4b12d6b8c51d` | Publication behavior API built on graph traversal. |
| `test/publication-behavior-contract.cjs` | `e47504b459447a9e3ba7508e26db4b12d6b8c51d` | Shared behavior contract used by the graph-first tests. |
| `test/graph-object-space.test.cjs` | `e47504b459447a9e3ba7508e26db4b12d6b8c51d` | Graph-first contract and trace tests. |

## Evidence Method

- [x] Automated test
- [x] Property/invariant check
- [ ] Static analysis
- [ ] Benchmark
- [x] Manual observation
- [ ] Integration exercise
- [x] Other: project-local RDF parse and line-count comparison signal

## Result

Command:

```sh
npm test
```

Result:

```text
tests 30
pass 30
fail 0
duration_ms 57.633795
```

The graph-first representation passes the shared publication behavior contract for:

- visible live pages;
- hidden draft pages;
- editor draft visibility without publish capability;
- referenced assets independent of containment;
- hierarchy/navigation projection without path identity;
- topic listing independent of navigation;
- allowed and denied visibility explanations;
- draft creation and editing;
- invalid publish rejection;
- valid publish;
- publish denial explanation;
- deterministic behavior precedence.

Additional graph-first tests verify:

- indexed relation traversal through `targets` and `sources`;
- authorization explanation including membership path, grant, and variant/containment scope trace;
- visibility explanation including workspace relation trace;
- behavior candidates including `usesBehavior` graph traces.

Project-local Turtle parse passed after the evidence artifact was added.

Human review accepted this as a valid graph-first baseline with passing tests, but added a material limitation: `ObjectSpace` defines an abstraction but is not itself built out of cleaner abstractions, so this evidence does not yet test the full Airadne idea.

## Comparison Signals

Simple line-count signal at this commit:

```text
381 src/conventional-baseline.cjs
544 src/graph-object-space.cjs
183 test/conventional-baseline.test.cjs
55  test/graph-object-space.test.cjs
191 test/publication-behavior-contract.cjs
```

This does not decide the comparison, but it is a useful early counterpressure: the graph-first implementation added more kernel code than the conventional baseline. Its compensating benefit is more structured explanation traces and a reusable behavior contract for later representations.

This comparison signal is stronger after human review: the current `ObjectSpace` layer is a monolithic implementation abstraction, not a demonstration that object-space semantics can be composed from smaller, cleaner primitives.

## Observed Implementation Shape

The graph-first implementation keeps three layers visible:

- `ObjectSpace`: indexes objects and relation facts and supports traversal.
- publication behavior: query, mutation, validation, authorization, projection, and behavior selection.
- tests: shared behavior contract plus graph-specific trace assertions.

Hierarchy remains a projection:

- object IDs are stable and path-independent;
- `contains` is evaluated as a typed relation;
- navigation is built as a projection;
- authorization scope traces label containment as `contains-projection` or `variant-target-contained`.

## Failure Cases / Limits

- This evidence does not prove graph-first is better than conventional code.
- This evidence does not test the full Airadne idea because `ObjectSpace` is not itself decomposed into cleaner abstractions.
- The graph-first implementation is larger than the conventional baseline for this small slice.
- Explanations are structured by code, not derived from an independent declarative model.
- No fresh-agent handover/change trial has been run.
- No commanded dataspace comparison exists yet.
- The graph kernel may still become too broad if later cycles add query-language behavior.

## Evidence Quality

The evidence can detect meaningful failure because the graph-first implementation must pass the same behavior contract as the baseline and additional graph-trace assertions. It checks both runtime behavior and whether decisions expose relation paths rather than hiding traversal in code.

The evidence is still preliminary because it measures correctness and trace shape, not actual AI inspection burden or human review cost.
