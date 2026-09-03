---
id: CTX-20260903-XCTYG-1
---

# Project Context

## Purpose

Durable project context for Airadne, a greenfield investigation into software architecture for AI-first development.

The project starts from the hypothesis that software designed around a very small executable semantic core plus compact domain-specific representations may be easier for AI developers to understand, modify, verify, and hand over than conventionally structured systems optimized for human programmers and general-purpose language familiarity.

This is an exploration. The project should actively try to falsify the hypothesis rather than treat it as an established design direction.

## Project

Name: Airadne

Repository/baseline: local repository `muze-labs/airadne`; initial non-Spiral repository commit `b317d3fc662ab754567d3d088d25440741e8cc5c`.

Project causal-graph namespace: `urn:spiral:muze-labs:airadne:`

Spiral core source: `.spiral-core/`, git submodule for `git@github.com:muze-labs/spiral-developer.git`, checked out at `8d4b2c738a413abd4cccca740ce958f486e5f7af` when this context was created.

Reference submodules:

| Repository | Local path | Role |
|---|---|---|
| `github.com/ariadne-cms/ariadne` | `ariadne/` | Historical evidence about long-lived object/content architecture |
| `github.com/simplyedit/simplystore` | `simplystore/` | Modern evidence about small data infrastructure |

## Greenfield Frame

Status: **Active**

Human-confirmed as a greenfield project on: 2026-09-03

Primary source: `.spiral/sources/SRC-20260903-XCTYG-2.md`

Current project understanding: `.spiral/understandings/UND-20260903-XCTYG-3.md`

Initial request: `.spiral/requests/REQ-20260903-XCTYG-4.md`

## Intended Users

Primary intended user: AI developers and AI coding agents that need to understand, modify, verify, and hand over software systems.

Secondary intended users: humans who inspect, review, challenge, and govern AI-produced or AI-maintained software.

## Current Direction

Start with evidence gathering rather than implementation.

Investigate Ariadne, SimplyStore, and small semantic experiments to produce a map of durable concepts, questionable assumptions, competing architectural directions, highest-risk unknowns, and cheap experiments capable of distinguishing between them.

Do not begin by designing a programming language, rewriting Ariadne, or assuming SimplyStore must be used.

## Governing Plans / Roadmaps

No governing multi-cycle implementation roadmap exists yet.

The current governing frame is exploratory: use early cycles to gather evidence and reduce uncertainty before committing to architecture.

## Project Goals And Important Outcomes

| Outcome / metric | Why it matters | Desired/acceptable level | Current evidence / unknown |
|---|---|---|---|
| Smaller effective semantic model | Central hypothesis | An unfamiliar AI can inspect enough of the system semantics to safely explain and change behavior with less context than conventional code would require | Hypothesis from greenfield intake; unproven |
| Explicit semantics | AI reasoning, auditability, and verification depend on knowing what behavior means | Semantics should be inspectable and mechanically testable rather than implicit in framework convention or generated code | Desired property from intake |
| Human auditability | AI-first must not mean human-opaque | Humans can inspect causal explanations and challenge requirements, primitives, and generated behavior | Desired property from intake; unproven |
| Provider/model handover | The system should not depend on one model's implicit context | A different AI model/provider can learn the project semantics from repository-local material | Desired property from intake; unproven |
| Independent verification | Trust should come from checks, not agent confidence | Proposed semantics and generated behavior have tests or other discriminating evidence | Spiral and intake alignment |
| Evidence before architecture | Prevent attractive ideas from hardening too early | Early output is an evidence map and experiment proposal, not a final design | Explicit source constraint |

## Project Posture

Greenfield research and architecture exploration.

The repo currently contains Spiral methodology and two evidence-source submodules. It does not yet contain product implementation.

## Important Invariants And Commitments

| Invariant / commitment | Practical meaning | Source/confidence |
|---|---|---|
| Do not assume the core hypothesis is true | Actively seek counterexamples and falsifying evidence | Greenfield intake / explicit |
| Do not start by designing a programming language | Language design is not authorized as the first move | Greenfield intake / explicit |
| Do not start by rewriting Ariadne | Ariadne is historical evidence, not an implementation target | Greenfield intake / explicit |
| Do not assume SimplyStore must be used | SimplyStore is a candidate substrate, not a constraint | Greenfield intake / explicit |
| Do not optimize primarily for LOC | The target is semantic inspectability, not line count theater | Greenfield intake / explicit |
| Do not introduce a DSL just because examples get shorter | A DSL must remove or expose complexity rather than hide it | Greenfield intake / explicit |
| Treat generated code as derived machinery | Generated code may be large only if independent meaning stays small and derivation is checkable | Greenfield intake / explicit |

## Core Concepts / Vocabulary

| Term | Meaning | Source/confidence |
|---|---|---|
| AI-first architecture | Architecture that treats AI context size, reasoning reliability, explicit semantics, and auditability as first-class constraints | Greenfield intake / explicit |
| Executable semantic model | The authoritative behavior/meaning an AI must inspect to safely reason about the system | Greenfield intake / explicit |
| Semantic core | The small trusted set of primitives or rules from which behavior is interpreted or generated | Greenfield intake / explicit |
| DSL | A compact domain-specific representation; useful only if it reduces meaningful complexity without hiding new semantics | Greenfield intake / explicit |
| Ariadne | Historical CMS/framework evidence source with long-lived object/content ideas | Greenfield intake / explicit |
| SimplyStore | Modern small data infrastructure evidence source and possible substrate hypothesis | Greenfield intake / explicit |

## Active Engineering Culture

No project-specific culture profile has been adopted yet.

The Muze engineering profile in `.spiral-core/cultures/muze-engineering.md` is available and likely relevant, but adoption should be explicit when it materially shapes a design or implementation choice.

## Active Warning Profiles

No warning profile has been adopted yet.

The bundled human-impact and epistemic warning profile is available, but it should not be treated as active unless intentionally adopted.

## Important Current Constraints

| Constraint | Source | Why it matters |
|---|---|---|
| Evidence gathering precedes implementation | Greenfield intake | Prevents early commitment to an attractive but untested architecture |
| Ariadne terminology should not be preserved unnecessarily | Greenfield intake | The project should identify fundamental properties, not clone historical vocabulary |
| Conventional web patterns are neither assumed nor rejected | Greenfield intake | Keeps the comparison honest |
| DSL value must be evaluated by where complexity moves | Greenfield intake | Prevents semantic compression from becoming hidden complexity |

## Reliable Feedback / Reality Sources

| Source | What it can tell us | Limits / freshness |
|---|---|---|
| Ariadne repository | Historical architecture mechanisms, evolved concepts, and long-lived pain points | Code/docs are evidence, not an oracle; current user/developer experience still needs human interpretation |
| SimplyStore repository | Modern small-data design choices, durability/reconstruction mechanisms, and current trade-offs | Built for human developers; suitability for AI-first architecture is unproven |
| Minimal semantic experiments | Whether candidate representations reduce AI context burden and improve verification | Experiments must be designed before conclusions can be trusted |
| AI handover trials | Whether repository-local semantics can be cheaply learned by another model/provider | Not yet performed |
| Human review | Whether explanations remain inspectable and challengeable | Not yet performed for any candidate architecture |

## Known / Tolerated Problems And Risks

| Concern | Current disposition | Evidence/source | Notes |
|---|---|---|---|
| Small syntax may hide large semantics | Investigate | Greenfield intake | Core falsification target |
| DSLs may impose human audit cost | Investigate | Greenfield intake | Human review remains a first-class property |
| Ariadne concepts may be era-specific | Investigate | Greenfield intake | Treat as historical evidence, not authority |
| SimplyStore may be the wrong substrate | Investigate | Greenfield intake | Do not let available code become architectural commitment |
| Generated implementation may reduce trust | Investigate | Greenfield intake | Requires mechanical derivation and independent verification |

## Later Possibilities

- One or more minimal semantic experiments.
- A comparison between conventional implementation, small-kernel-plus-DSL implementation, and derived/generated implementation.
- A repository-local semantics manual intended for fast AI handover.
- A falsification report if the hypothesis does not survive evidence.

## Durable Non-Goals

- Do not begin by designing a programming language.
- Do not begin by rewriting Ariadne.
- Do not assume SimplyStore must be used.
- Do not optimize primarily for LOC.
- Do not add a DSL merely to shorten examples.
- Do not treat generated code as authoritative meaning unless derivation from a smaller representation is explicit and testable.
