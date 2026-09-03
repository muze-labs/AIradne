---
id: DES-20260903-XCTYG-11
---

# Design: Graph-First Publication Experiment

## Role

This design defines the experiment protocol for Airadne's first implementation comparison.

It specifies one shared publication-workspace slice, the graph identity model that every candidate must support, the behaviors each representation must implement, and the evaluation evidence needed to judge whether an AI-first semantic approach is actually better than conventional explicit code.

## Why This Exists

The accepted initial evidence map recommends a small publication-workspace experiment instead of choosing architecture by argument.

The accepted human feedback materially shapes the experiment: hierarchical identity is insufficient. The experiment must therefore test stable identity plus typed graph relationships first, with hierarchy represented as a projection/containment relation rather than the identity model.

## Cultural Influence / Constraints

This design follows the Airadne warning profile:

- Evidence over assertion: each representation must produce inspectable evidence, not just working behavior.
- Avoid premature model closure: no representation may assume hierarchy is the only navigable shape.
- Preserve optionality: the experiment must compare approaches before choosing a substrate, DSL, or generated runtime.
- Human and AI auditability: success requires explanation paths that a later agent and a human can challenge.

## Experiment Question

Can a small semantic representation based on stable IDs, typed graph relationships, semantic commands, derived projections, and explicit behavior/authorization rules reduce AI and human reasoning burden compared with conventional explicit code?

The experiment should also reveal whether the proposed semantic compression merely moves complexity into interpreter, projection, authorization, or command rules.

## Domain Slice

The shared slice is a small publication workspace, not a CMS product.

Required object types:

| Type | Minimal fields | Notes |
|---|---|---|
| `site` | `id`, `slug`, `title` | Root publication context, but not root identity for every object. |
| `section` | `id`, `slug`, `title` | Can provide projected navigation and local behavior context. |
| `page` | `id`, `slug`, `title`, `body`, `status` | Status values: `draft`, `published`. |
| `asset` | `id`, `slug`, `mediaType`, `label` | Referenced by pages; may appear in multiple contexts. |
| `topic` | `id`, `slug`, `label` | Tests non-hierarchical organization. |
| `language` | `id`, `tag`, `label` | Tests alternate projections and variants. |
| `workspace` | `id`, `slug`, `label` | Tests draft/published separation without requiring a full branch system. |
| `user` | `id`, `handle` | Actor for query, mutation, and authorization. |
| `group` | `id`, `slug`, `label` | Actor grouping for capability rules. |

Required relation types:

| Relation | From | To | Purpose |
|---|---|---|---|
| `contains` | `site` or `section` | `section`, `page`, or `asset` | Defines projected hierarchy/navigation, not identity. |
| `references` | `page` | `asset` | Tests graph traversal independent of containment. |
| `taggedWith` | `page` or `asset` | `topic` | Tests alternate organization. |
| `variantOf` | `page` | `page` | Tests language or workspace variants without path identity. |
| `inLanguage` | `page` | `language` | Tests language selection as explicit graph fact. |
| `inWorkspace` | `page` or `asset` | `workspace` | Tests workspace scoping. |
| `memberOf` | `user` | `group` | Tests actor graph. |
| `grants` | `group` or `user` | capability on object/relation scope | Tests authorization as explicit relation. |
| `usesBehavior` | `section`, `topic`, or `site` | behavior rule | Tests contextual behavior outside parent-only lookup. |

Required capabilities:

| Capability | Meaning |
|---|---|
| `view` | Read published content visible to the actor. |
| `edit` | Create or update draft pages/assets. |
| `publish` | Change valid draft pages to published. |
| `configureBehavior` | Attach or change rendering/validation behavior context. |

## Required Fixture

Every representation must start from the same logical fixture:

- Site `s-main`.
- Sections `sec-news` and `sec-guides`.
- Pages `pg-launch`, `pg-install`, `pg-draft`.
- Asset `asset-logo`, referenced by `pg-launch` and visible through more than one context.
- Topics `topic-release` and `topic-setup`.
- Languages `lang-en` and `lang-nl`.
- Workspaces `ws-live` and `ws-draft`.
- Users `u-ada`, `u-bert`, `u-cy`.
- Groups `g-viewers`, `g-editors`, `g-publishers`.

Required fixture shape:

- `s-main contains sec-news`.
- `s-main contains sec-guides`.
- `sec-news contains pg-launch`.
- `sec-guides contains pg-install`.
- `pg-launch references asset-logo`.
- `pg-install references asset-logo`.
- `pg-launch taggedWith topic-release`.
- `pg-install taggedWith topic-setup`.
- `pg-draft variantOf pg-launch`.
- `pg-launch inLanguage lang-en`.
- `pg-draft inLanguage lang-nl`.
- `pg-launch inWorkspace ws-live`.
- `pg-install inWorkspace ws-live`.
- `pg-draft inWorkspace ws-draft`.
- `u-ada memberOf g-viewers`.
- `u-bert memberOf g-editors`.
- `u-cy memberOf g-publishers`.
- `g-viewers grants view on s-main`.
- `g-editors grants view and edit on ws-draft`.
- `g-publishers grants view, edit, and publish on s-main`.
- `sec-guides usesBehavior behavior-guide-render`.
- `topic-release usesBehavior behavior-release-validation`.

Intentional graph pressure:

- `asset-logo` must be referenced by multiple pages and must not be owned by a single hierarchy path.
- `pg-draft` must be related to `pg-launch` as a variant while living in a different workspace and language.
- Behavior can come from a section relation or topic relation, so behavior lookup cannot be only parent traversal.
- Authorization must explain whether capability came from group membership, workspace relation, site containment projection, or direct actor grant.

## Required Behaviors

Each candidate representation must support the same behavior surface.

### Query

- List pages visible to a user in a workspace.
- Resolve assets referenced by a visible page.
- Build a hierarchical navigation projection for a site.
- List pages by topic independent of navigation.
- Explain why a specific page is visible or hidden to a user.

### Mutation

- Create a draft page with title/body/language/workspace/topic relations.
- Update a draft page body.
- Add an asset reference to a page.
- Publish a valid draft page.
- Reject publishing an invalid draft page.

### Validation

- A published page requires non-empty `title` and `body`.
- `behavior-release-validation` additionally requires pages tagged `topic-release` to reference at least one asset.
- A page must belong to exactly one workspace.
- A page may have at most one `inLanguage` relation for this experiment.
- A contained page must not derive its identity from its containment path.

### Authorization

- Viewers can view published live pages through the site projection.
- Editors can edit draft workspace content but cannot publish.
- Publishers can publish valid pages and configure behavior.
- Every denied action must produce an explanation identifying the failed capability path.

### Contextual Behavior

- Rendering behavior selection must consider explicit relations in a deterministic order.
- Section behavior can affect pages contained in that section projection.
- Topic behavior can affect pages tagged with that topic.
- If both section and topic behavior apply, the representation must explain precedence.

Required precedence for the experiment:

1. Direct page behavior relation.
2. Topic behavior relation.
3. Section behavior through containment projection.
4. Site default behavior.

This precedence is not proposed as final Airadne semantics; it is fixed here only to make comparison fair.

## Compared Representations

### Representation A: Conventional Explicit Code Baseline

Use ordinary modules, data structures, and tests. The code may be simple and direct. It must not use an Airadne-specific DSL or generated runtime.

Boundary:

- Allowed: plain data fixtures, explicit functions, tests, concise documentation.
- Not allowed: semantic interpreter, code generator, custom query language, hidden metadata engine.

Purpose:

This is the control condition. If it is easier for AI and humans to inspect, the Airadne semantic hypothesis weakens.

### Representation B: Graph-First Object-Space Kernel

Use stable IDs, typed relation facts, explicit projection rules, behavior-selection rules, validation rules, and authorization rules.

Boundary:

- Allowed: a small interpreter or runtime that evaluates facts/rules for this slice.
- Not allowed: assuming containment path is identity, generic unbounded graph query language, generated application runtime.

Purpose:

This tests whether Ariadne-like object-space strengths survive when graph identity replaces hierarchy identity.

### Representation C: Commanded Dataspace Kernel

Use immutable read state, semantic commands, command log/replay, derived indexes/projections, and explicit validation/authorization around commands.

Boundary:

- Allowed: command handlers, command log, read model derivation, fixture commands.
- Not allowed: arbitrary JavaScript query as the primary semantic model, full database abstraction, hidden mutation through queries.

Purpose:

This tests the SimplyStore-shaped claim that meaningful commands plus immutable read views provide better causal traceability and graph-shaped data handling.

## Evaluation Tasks

Later implementation cycles should run the same task set against each representation:

| Task | Change requested | What to measure |
|---|---|---|
| Publish validation change | Require `topic-release` pages to include an asset with `mediaType=image/*`. | Files/concepts inspected, tests changed, explanation quality, unintended behavior changes. |
| Behavior explanation | Explain why `pg-install` uses guide rendering. | Whether explanation traces relation/projection/precedence without reading unrelated code. |
| Authorization explanation | Explain why `u-bert` cannot publish `pg-draft`. | Whether denial path is inspectable and precise. |
| Projection change | Add topic-based navigation without changing object identity. | Change radius and whether hierarchy assumptions leak. |
| Handover trial | Ask a fresh AI agent to make one small safe change. | Context needed, mistakes made, confidence calibration, verification evidence. |

## Metrics And Evidence To Record

For each representation, record:

- implementation files touched;
- test files touched;
- semantic concepts an unfamiliar AI had to inspect;
- total explanation path for validation, behavior selection, authorization, and projection;
- whether explanation is generated, handwritten, or reconstructed by reading code;
- places where complexity moved;
- known hidden assumptions;
- test failures caught during development;
- approximate time to make and verify one small behavior change;
- human review notes on whether the representation is understandable.

No single metric decides the result. The expected output is a comparison map with counterexamples and confidence, not a scorecard winner.

## Falsification Conditions

The graph-first object-space candidate is weakened if:

- relation/projection/behavior rules require so much interpreter knowledge that ordinary code is easier to inspect;
- hierarchy assumptions reappear as hidden identity;
- authorization explanations are less clear than the conventional baseline;
- a small behavior change has wide rule-engine blast radius.

The commanded dataspace candidate is weakened if:

- command handlers hide as much intent as conventional code;
- read model derivation becomes the real complexity center;
- replay/audit adds ceremony without improving explanation;
- query needs push the design toward arbitrary code execution.

The conventional baseline is weakened if:

- behavior, authorization, projection, and validation logic scatter across files;
- AI handover requires substantially more unrelated context;
- explanations must be manually reconstructed from implementation details;
- adding graph projections creates ad hoc duplicated structures.

The broader Airadne hypothesis is weakened if:

- neither semantic representation beats the conventional baseline on inspection burden, explanation quality, and safe change radius;
- compact representations are pleasant to write but harder to audit;
- the experiment cannot produce independent tests for the semantics it claims to encode.

## Boundaries

What belongs here:

- Shared logical fixture.
- Shared behavior surface.
- Shared comparison protocol.
- Required measurements and falsification criteria.
- Constraints that preserve graph-first identity and hierarchy-as-projection.

What must remain outside:

- Implementation code.
- Runtime/framework choice.
- DSL grammar or syntax design.
- Persistence, deployment, authentication, UI polish, import/export, and real CMS scope.
- Final architecture selection.

What change should this boundary protect us from:

The experiment should prevent Airadne from accidentally selecting Ariadne-style hierarchy, SimplyStore substrate, a generated runtime, or conventional code because one was easiest to start coding first.

## Supporting / Intrinsic Work

| Support | Why necessary |
|---|---|
| Shared fixtures | Prevents each representation from simplifying away the graph/hierarchy tension differently. |
| Explanation outputs | Tests AI/human auditability directly rather than inferring it from passing tests. |
| Conventional baseline | Keeps novelty honest and gives the semantic approaches a real control. |
| Falsification criteria | Allows the project to reject attractive abstractions if they move complexity out of sight. |

## Alternatives Considered

| Alternative | Why not now | Evidence / trade-off |
|---|---|---|
| Start implementing the graph-first kernel immediately | Too likely to harden syntax/runtime choices before the protocol is fair. | Accepted evidence says implementation should compare approaches against the same slice. |
| Use Ariadne compatibility as the first target | Would privilege historical hierarchy and CMS behavior too early. | Ariadne is evidence, not oracle or compatibility target. |
| Use SimplyStore directly as the substrate | Would make substrate selection before proving commanded dataspace helps Airadne. | SimplyStore is promising evidence, but its query sandbox and scope limits remain counterpressure. |
| Build a larger CMS/editor slice | More realistic but too large for first falsification. | The first experiment should be cheap enough to abandon or reshape. |
| Compare generated runtime now | Useful later, but generator complexity would obscure the first semantic comparison. | The accepted evidence recommends generated runtime only after simpler comparisons expose what matters. |

## Complexity / Maintainability Check

- Concepts introduced: stable object ID, typed relation, containment projection, behavior rule, validation rule, capability grant, semantic command, read model, explanation path, representation comparison.
- Dependencies introduced: none by this design.
- Expected change radius: implementation cycles should be able to add one isolated directory per representation plus shared fixture/test definitions.
- Replaceability considerations: any representation can fail without invalidating the whole experiment if the shared fixture and evaluation tasks survive.
- What would make this harder for a future agent/human to change: implicit rule precedence, oversized fixtures, unbounded graph query power, or mixing implementation choices into the protocol.

## Verification Plan

This design is verified when a later implementation cycle can produce, for each compared representation:

- the shared fixture encoded without changing its logical shape;
- tests for query, mutation, validation, authorization, and behavior precedence;
- explanation output for behavior selection and authorization decisions;
- a recorded small-change task with files/concepts inspected;
- a comparison artifact that can say which representation failed, succeeded, or needs revision.

Design acceptance should check only whether this is the right experiment to build next, not whether any representation will win.

## Deferred Decisions

- Runtime language.
- Test framework.
- Storage format.
- DSL syntax.
- Whether SimplyStore is used directly, adapted, or only imitated.
- Whether generated runtime becomes a later fourth representation.
- UI/editor scope.
- Real persistence, import/export, deployment, and multi-user concurrency.
