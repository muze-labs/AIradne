---
id: EVD-20260903-XCTYG-14
---

# Verification Evidence: Conventional Baseline

## Claim Being Verified

The conventional explicit-code baseline implements the shared publication fixture and required behavior surface from `DES-20260903-XCTYG-11` well enough to serve as Airadne's control condition for later semantic comparisons.

## Why This Evidence Exists

This evidence supports cycle `CYC-20260903-XCTYG-12` and verifies implementation `IMP-20260903-XCTYG-13`.

The project needs a working non-DSL baseline before evaluating graph-first object-space or commanded dataspace representations.

## Implementation Under Test

| Artifact/path/symbol | Commit | Role |
|---|---|---|
| `IMP-20260903-XCTYG-13` | `f7d103caa17c8b3a2d827255f1597949c57664f3` | Governed implementation artifact. |
| `package.json` | `f7d103caa17c8b3a2d827255f1597949c57664f3` | Project test command. |
| `src/publication-fixture.cjs` | `f7d103caa17c8b3a2d827255f1597949c57664f3` | Shared fixture. |
| `src/conventional-baseline.cjs` | `f7d103caa17c8b3a2d827255f1597949c57664f3` | Conventional baseline behavior. |
| `test/conventional-baseline.test.cjs` | `f7d103caa17c8b3a2d827255f1597949c57664f3` | Automated verification. |

## Evidence Method

- [x] Automated test
- [x] Property/invariant check
- [ ] Static analysis
- [ ] Benchmark
- [x] Manual observation
- [ ] Integration exercise
- [x] Other: project-local RDF parse

## Result

Command:

```sh
npm test
```

Result:

```text
tests 13
pass 13
fail 0
duration_ms 55.695721
```

The tests cover:

- visible live pages for a viewer;
- hidden draft pages for a viewer without draft access;
- editor draft visibility without publish capability;
- referenced assets independent of containment;
- hierarchy/navigation projection without path identity;
- topic listing independent of navigation;
- visibility explanation for allowed and hidden pages;
- draft creation and editing;
- invalid release-page publish rejection;
- valid draft publish by a publisher;
- publish denial explanation for an editor;
- deterministic behavior precedence.

Project-local Turtle parse also passed after the evidence artifact was added.

## Observed Implementation Shape

The conventional baseline is intentionally understandable ordinary code:

- fixture objects are plain records keyed by stable IDs;
- relations are plain records with `type`, `from`, and `to`;
- authorization grants are explicit relation records;
- hierarchy is represented only through `contains` relations and projection functions;
- visibility, validation, authorization, mutation, and behavior selection are separate exported functions;
- explanation objects are explicit return values rather than generated traces.

The first test run exposed an important harness issue: `node --test` without a target discovered tests inside the Ariadne and SimplyStore submodules. The project test script was scoped to `test/*.test.cjs` so Airadne verification does not accidentally include evidence-repository tests.

## Failure Cases / Limits

- This evidence does not compare the baseline against the graph-first or commanded-dataspace representations.
- This evidence does not measure fresh-agent handover cost yet.
- The baseline uses in-memory fixture clones only.
- The fixture may still be too small to expose all historical Ariadne graph/hierarchy pain.
- The baseline code may look acceptable partly because the domain slice is intentionally small.

## Evidence Quality

The evidence can detect meaningful failures because the tests exercise the cross-cutting behavior that the design identified as risky: graph references, containment projection, topic organization, workspace scoping, authorization explanation, validation, mutation, and behavior precedence.

It is not merely a smoke test: several assertions inspect explanation structure and state invariants, not just returned object lists.
