---
id: IMP-20260903-XCTYG-13
---

# Implementation: Conventional Publication Baseline

## Scope

This implementation provides representation A from `DES-20260903-XCTYG-11`: the conventional explicit-code baseline for the publication-workspace experiment.

It includes the shared fixture, plain functions for the required behavior surface, and Node built-in tests. It intentionally does not introduce an Airadne semantic interpreter, DSL, generated runtime, storage engine, or UI.

## Observable Behavior

The baseline supports:

- listing pages visible to a user in a workspace;
- resolving assets referenced by a page;
- building a hierarchy/navigation projection without path identity;
- listing pages by topic independent of navigation;
- explaining why a page is visible or hidden;
- creating and editing draft pages;
- adding asset references;
- publishing valid drafts;
- rejecting invalid draft publishing;
- explaining authorization denial paths;
- selecting behavior by deterministic precedence across direct page, topic, section projection, and site default relations.

## Repository Locations

| Path / symbol | Role |
|---|---|
| `package.json` | Defines the local Node test command without external dependencies. |
| `src/publication-fixture.cjs` | Shared publication fixture with stable IDs, typed objects, typed relations, behavior records, and grants. |
| `src/conventional-baseline.cjs` | Explicit-code implementation of query, mutation, validation, authorization, projection, and behavior-selection functions. |
| `test/conventional-baseline.test.cjs` | Verification tests for the conventional baseline behavior surface. |

## Effective Provenance

This implementation is justified by the accepted graph-first publication experiment design. It establishes the control condition before graph-first object-space or commanded dataspace representations are implemented.

The implementation also carries forward the accepted hierarchy correction: object IDs are stable, and `contains` is treated as a projection relation rather than identity.

## Revision Lineage

- Predecessor implementation version(s): none.
- Transition cause(s): first implementation of representation A.
- Change kind: semantic.

## Important Implementation Decisions

- Use CommonJS and Node's built-in `node:test` runner to avoid dependency and framework noise in the control condition.
- Scope `npm test` to `test/*.test.cjs` so Node does not run tests inside the Ariadne and SimplyStore evidence submodules.
- Represent relations as plain records rather than hiding them behind classes or a graph library.
- Return structured explanation objects for authorization and visibility decisions, because explanation quality is part of the experiment.
- Keep behavior precedence as ordinary code matching the design's fixed comparison order, not as proposed final Airadne semantics.

## New Dependencies / Capabilities / Permissions

No external dependencies were added.

The only new project capability is a local test command:

```sh
npm test
```

## Known Limits

- The baseline is intentionally direct code, so graph traversal, authorization, and behavior precedence are spread through ordinary functions.
- The fixture is small and may not yet capture every historical Ariadne graph pain point.
- The implementation does not yet record comparative AI-inspection measurements; it only creates the control condition needed for those measurements.
- The publishing flow mutates in-memory fixture clones only; there is no persistence, command log, UI, or multi-user concurrency.
