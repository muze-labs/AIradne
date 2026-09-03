---
id: EVD-20260903-XCTYG-29
---

# Evidence: Release Validation Change Comparison

## Role

This evidence records the first original evaluation-task change from `DES-20260903-XCTYG-11` as an added evaluation step inside cycle `CYC-20260903-XCTYG-24`.

## Task Under Test

Publish validation change:

> Require `topic-release` pages to include an asset with `mediaType=image/*`.

## Implementation Under Test

Commit:

```text
9e6fc49eae70de9fd379b8ff302e23584389b490
```

Implementation artifact:

```text
IMP-20260903-XCTYG-28
```

## Automated Test Result

Command:

```text
npm test
```

Observed result:

```text
tests 38
pass 38
fail 0
cancelled 0
skipped 0
todo 0
duration_ms 71.426376
```

## Spiral Artifact Parse

Command:

```text
PYTHONPATH=/tmp/airadne-rdflib python3 -c "from rdflib import Graph; from pathlib import Path; g=Graph(); [g.parse(str(p), format='turtle') for p in Path('.spiral').rglob('*.ttl')]; print(f'parsed {len(g)} triples from project .spiral TTL')"
```

Observed result:

```text
parsed 400 triples from project .spiral TTL
```

## Files / Concepts Inspected

Original experiment task:

- `DES-20260903-XCTYG-11`

Shared data shape:

- `src/publication-fixture.cjs`
- object fields: `type`, `mediaType`
- relation type: `references`
- behavior relation: `usesBehavior`

Conventional representation:

- `src/conventional-baseline.cjs`
- `validatePage`
- `selectBehavior`
- `resolveReferencedAssets`
- `test/conventional-baseline.test.cjs`

Graph-first representation:

- `src/graph-object-space.cjs`
- `validatePage`
- `selectBehavior`
- `resolveReferencedAssets`
- `test/publication-behavior-contract.cjs`

Graph primitives:

- Not changed.
- Not needed for the implementation after confirming referenced-asset traversal already existed.

## What Changed

- Added non-image fixture asset `asset-handbook` with `mediaType: "application/pdf"`.
- Changed conventional release validation to require at least one referenced asset with media type starting `image/`.
- Changed graph-first release validation to require the same condition.
- Added rejection coverage for release pages that reference only a non-image asset.
- Updated the existing no-asset release validation assertion to the image-specific message.

## Development Observation

The first test run failed in `test/conventional-baseline.test.cjs` because the conventional-only test still expected the previous "at least one asset" validation message. The shared graph-first behavior contract had already been updated.

This is useful evidence that duplicated representation-specific tests can become stale independently from the shared contract.

## Comparison Result

This task did not require changing the compositional graph primitives. That is positive evidence for the graph/kernel boundary: object storage, relation facts, relation indexing, and traversal were not the relevant change points.

The change pressure landed in publication semantics:

- selecting the validation behavior;
- resolving referenced assets;
- checking asset media type;
- returning a validation error;
- keeping tests aligned across representations.

Both conventional and graph-first implementations still encode the release-image rule as procedural JavaScript inside `validatePage`. The graph-first version carries more explanation context because validation returns the selected behavior, but the rule itself is not yet data-shaped or independently evaluated.

## Implication For Next Abstraction

This supports the reflection that the next unresolved abstraction is probably not another graph-kernel split. The remaining pressure is the publication rule/evaluation/explanation layer.

However, this implication is earned by the change task rather than assumed:

- graph primitives stayed stable;
- publication validation changed in both representations;
- test duplication surfaced as comparison noise;
- the behavior-rule relation selected the correct validation behavior, but the validation rule body remained hard-coded.

## Limits

- This was one small change task, not a fresh-agent handover trial.
- The task did not require changing authorization or behavior precedence, so it does not evaluate all remaining rule clusters.
- The comparison remains between conventional and graph-first only; the commanded dataspace representation has not been implemented.

## Confidence

Medium. The task gives concrete evidence about where this kind of change lands, but the broader rule/explanation abstraction still needs design before implementation.
