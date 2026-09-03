---
id: IMP-20260903-XCTYG-28
---

# Implementation: Release Validation Requires Image Asset

## Role

This implementation performs the first original evaluation-task change from `DES-20260903-XCTYG-11`: require release-topic pages to reference an image asset rather than any asset.

## Cycle

`CYC-20260903-XCTYG-24`

## Evaluation Task

Publish validation change:

> Require `topic-release` pages to include an asset with `mediaType=image/*`.

## Implementation Locations

- `src/publication-fixture.cjs`
- `src/conventional-baseline.cjs`
- `src/graph-object-space.cjs`
- `test/conventional-baseline.test.cjs`
- `test/publication-behavior-contract.cjs`

## What Changed

Added `asset-handbook` to the shared fixture with `mediaType: "application/pdf"` so the test can distinguish "has any asset" from "has an image asset."

Changed conventional validation so `behavior-release-validation` requires at least one referenced asset whose media type starts with `image/`.

Changed graph-first validation in the same semantic place: `validatePage` checks referenced assets after selecting `behavior-release-validation`.

Added non-image rejection tests:

- conventional-only baseline test rejects publishing a release page that references only `asset-handbook`;
- shared publication behavior contract rejects the same case for graph-first publication.

Updated the old no-asset validation assertion to expect the image-specific validation message.

## Inspection / Change Trail

Files inspected before and during the change:

- `DES-20260903-XCTYG-11`: original evaluation task definition.
- `src/publication-fixture.cjs`: asset fixture shape and media type evidence.
- `src/conventional-baseline.cjs`: conventional validation behavior.
- `src/graph-object-space.cjs`: graph-first validation behavior and relation-based asset resolution.
- `test/conventional-baseline.test.cjs`: conventional-only validation tests.
- `test/publication-behavior-contract.cjs`: shared behavior contract for graph-first representation.

Graph primitives did not need changes.

## Comparison Observation

This task touched both representations in ordinary validation code. The compositional graph primitives helped by staying out of the change: relation lookup and referenced-asset resolution already had enough shape. The unresolved abstraction pressure remains in publication validation semantics and test duplication, not in graph storage or traversal.

The graph-first implementation preserved richer behavior-selection evidence because `validatePage` returns the selected validation behavior. The conventional baseline still returns only `valid` and `errors` from validation, though it satisfies the current tests.

## Known Compromises

- The release validation rule is still hard-coded in both representations.
- There is no data-shaped validation rule or shared rule evaluator yet.
- The same non-image test exists in both the conventional-only tests and the shared graph-first contract because the conventional baseline has not been migrated to the shared contract helper.

## Verification

Verification is recorded in `EVD-20260903-XCTYG-29`.
