---
id: IMP-20260903-XCTYG-15
---

# Implementation: Graph-First Object-Space Baseline

## Scope

This implementation provides representation B from `DES-20260903-XCTYG-11`: a graph-first object-space baseline for the publication-workspace experiment.

It adds a small generic `ObjectSpace` over stable object IDs and typed relation records, then layers publication behavior on top of graph traversal, scope traces, authorization traces, validation, projection, and behavior-selection rules.

## Observable Behavior

The graph-first baseline supports the same user-facing behavior surface as the conventional baseline:

- listing pages visible to a user in a workspace;
- resolving assets referenced by a page;
- building hierarchy/navigation projections from `contains` relations;
- listing pages by topic independent of navigation;
- explaining why a page is visible or hidden;
- creating and editing draft pages;
- adding asset references;
- publishing valid drafts;
- rejecting invalid draft publishing;
- explaining authorization denial paths;
- selecting behavior by deterministic precedence across direct page, topic, section projection, and site default relations.

It additionally exposes graph-shaped explanation details:

- membership paths from users to groups;
- grant records used for authorization;
- scope traces through workspace, containment, or variant/containment paths;
- behavior candidate traces through `usesBehavior` relations;
- navigation projection metadata identifying `contains` as projection over stable IDs.

## Repository Locations

| Path / symbol | Role |
|---|---|
| `src/graph-object-space.cjs#ObjectSpace` | Generic object/relation index and traversal layer. |
| `src/graph-object-space.cjs#createGraphFirstPublication` | Publication behavior API built on `ObjectSpace`. |
| `test/publication-behavior-contract.cjs#definePublicationBehaviorContract` | Shared behavior contract for representations with the same API. |
| `test/graph-object-space.test.cjs` | Graph-first behavior contract and graph-trace verification tests. |

## Effective Provenance

This implementation is justified by the accepted graph-first publication experiment design and follows the conventional baseline so the project can compare representation B against representation A.

The implementation preserves the accepted correction that hierarchy is not identity: object IDs remain stable, `contains` is evaluated as a relation, and containment traces are labeled as projection paths.

## Revision Lineage

- Predecessor implementation version(s): none.
- Transition cause(s): first implementation of representation B.
- Change kind: semantic.

## Important Implementation Decisions

- Keep `ObjectSpace` generic enough to index objects and typed relations without becoming a general query language.
- Keep publication rules explicit and separate from graph indexing so future agents can distinguish kernel behavior from domain behavior.
- Use the same fixture shape as the conventional baseline rather than adding a graph-specific fixture.
- Add a shared behavior contract test helper for fair comparison across representations.
- Return graph traces in explanations so authorization, visibility, behavior selection, and projection decisions can be audited without guessing which traversal occurred.
- Keep behavior precedence fixed to the design's comparison order without treating it as final Airadne semantics.

## New Dependencies / Capabilities / Permissions

No external dependencies were added.

The existing test command continues to verify the project:

```sh
npm test
```

## Known Limits

- The graph-first implementation is still in-memory and uses plain JavaScript objects.
- `ObjectSpace` is a useful abstraction boundary, but it is not itself built from smaller cleaner abstractions; this implementation does not yet test the full Airadne semantic-core idea.
- `ObjectSpace` is intentionally small and does not include a query language, persistence, transaction model, or command log.
- The shared behavior contract proves parity on this slice, not superiority over the conventional baseline.
- Explanation traces are structured by the implementation; they are not independently derived from a declarative semantics layer.
