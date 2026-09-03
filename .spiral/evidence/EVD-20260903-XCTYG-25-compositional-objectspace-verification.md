---
id: EVD-20260903-XCTYG-25
---

# Evidence: Compositional Object-Space Verification

## Role

This evidence verifies implementation `IMP-20260903-XCTYG-26` for cycle `CYC-20260903-XCTYG-24`.

## Implementation Under Test

Commit:

```text
df0c20317dae5c9c942cc00dc9d075d1f9eb6a27
```

Implementation artifact:

```text
IMP-20260903-XCTYG-26
```

## Automated Test Result

Command:

```text
npm test
```

Observed result:

```text
tests 36
pass 36
fail 0
cancelled 0
skipped 0
todo 0
duration_ms 81.465941
```

The suite includes:

- the conventional baseline behavior tests;
- the graph-first shared publication behavior contract;
- graph-first explanation tests;
- new graph primitive tests.

## Spiral Artifact Parse

Command:

```text
PYTHONPATH=/tmp/airadne-rdflib python3 -c "from rdflib import Graph; from pathlib import Path; g=Graph(); [g.parse(str(p), format='turtle') for p in Path('.spiral').rglob('*.ttl')]; print(f'parsed {len(g)} triples from project .spiral TTL')"
```

Observed result:

```text
parsed 347 triples from project .spiral TTL
```

The full Spiral validator was not used because previous cycles found the nested `.spiral-core/.spiral` history can produce duplicate legacy IDs. Project-local Turtle parsing is the relevant check for this repository's new artifacts.

## Primitive Boundary Evidence

New tests verify these primitives without the publication fixture:

- object registry indexes objects by type and rejects duplicate IDs/type mismatches;
- relation facts validate endpoints and expose relation records independently of indexing;
- relation index supports edge/source/target lookup and refreshes after relation mutation;
- generic graph traversal finds typed paths without relation meaning;
- generic ancestor traversal returns paths toward roots;
- containment projection names `contains` semantics and records stable ID identity separately from the projection relation.

This is positive evidence that the graph kernel can be understood below publication-domain semantics.

## Behavior Preservation Evidence

The existing graph-first publication tests still pass. In particular:

- visible-page listing behavior is preserved;
- draft visibility behavior is preserved;
- asset references remain independent of containment;
- navigation projection still preserves stable object identity;
- topic listing remains independent of navigation;
- authorization explanations still include membership, grant, and scope traces;
- behavior selection still follows deterministic precedence.

## Size / Shape Evidence

Line counts after implementation:

```text
250 src/graph-primitives.cjs
452 src/graph-object-space.cjs
381 src/conventional-baseline.cjs
141 test/graph-primitives.test.cjs
55  test/graph-object-space.test.cjs
183 test/conventional-baseline.test.cjs
191 test/publication-behavior-contract.cjs
```

Compared with the prior graph-first baseline, `src/graph-object-space.cjs` shrank from 544 lines to 452 lines, but total graph implementation code increased because `src/graph-primitives.cjs` now carries explicit primitive boundaries.

This is not a failure by itself under the accepted AI-first caveat. The question is whether the added vocabulary reduces hidden semantics and improves independent verification.

## Evaluation Against Design

Positive:

- `ObjectSpace` is now a facade over explicit primitives.
- Relation indexing and generic traversal contain no publication-domain words.
- Containment projection is separate from generic traversal.
- Primitive tests are domain-neutral and can fail without loading the publication behavior contract.
- Publication behavior and explanation tests remain green.

Limits:

- `ObjectSpace` still exists.
- Publication rules still live in `src/graph-object-space.cjs`, so that file remains the main domain rule center.
- Explanation assembly still happens in publication rules rather than through a separate explanation primitive.
- Relation facts keep the current edge shape; no normalized fact model has been tested.
- This does not yet compare fresh-agent context burden before and after the refactor.

## Falsification Movement

The cycle strengthens the compositional hypothesis relative to `FBK-20260903-XCTYG-18` because the graph layer now has independently testable pieces.

It does not fully prove the AI-first hypothesis. The implementation grew in total code size and added new vocabulary. The stronger claim requires later evidence that a fresh agent can understand or change graph behavior with less context than before.

## Confidence

Medium. Automated behavior preservation and primitive tests are strong local evidence. The context-burden and handover claims remain untested.
