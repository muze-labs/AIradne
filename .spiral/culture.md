---
id: CUL-20260903-XCTYG-5
---

# Engineering Culture: Airadne Muze Engineering Defaults

## Purpose

Airadne adopts the Muze Engineering Culture as a defeasible default for underdetermined engineering choices.

This culture should help the project choose among otherwise trustworthy approaches. It is not a hidden requirement, an automatic veto, or a substitute for evidence.

## Canonical Sources

| Source | Commit/version if known | Role |
|---|---|---|
| `.spiral-core/cultures/muze-engineering.md` | Spiral core submodule commit `8d4b2c738a413abd4cccca740ce958f486e5f7af` | Bundled Muze Engineering Culture profile adopted for Airadne |

## Human Validation / Recognition

The human explicitly confirmed adoption for Airadne on 2026-09-03.

The adopted emphasis for this project is simplicity, inspectability, correctable boundaries, and evidence before abstraction.

## Principles

| ID | Principle | Why it matters | Possible evidence/proxies |
|---|---|---|---|
| CUL-20260903-XCTYG-5-P1 | Prefer evidence before abstraction | Airadne is especially vulnerable to attractive abstractions hardening before they prove they reduce AI reasoning burden | Candidate abstractions are preceded by evidence maps, falsification attempts, and comparison with ordinary code |
| CUL-20260903-XCTYG-5-P2 | Prefer small, explicit, inspectable semantics | The project hypothesis depends on semantics that AI agents and humans can inspect directly | Semantics can be read locally, tested independently, and explained without loading a large hidden framework |
| CUL-20260903-XCTYG-5-P3 | Design for correction | Early architecture assumptions are likely to be wrong or incomplete | Boundaries make replacement and revision cheap; rejected alternatives remain visible |
| CUL-20260903-XCTYG-5-P4 | Keep ideas high until earned | New DSL primitives or semantic-kernel features should not become foundations before repeated evidence supports them | Experimental representations stay local until their generality and value are credible |
| CUL-20260903-XCTYG-5-P5 | Prefer problem fit over convention or novelty | Conventional frameworks and new DSLs are both tools, not ideologies | Designs compare what complexity each approach removes, adds, or hides |
| CUL-20260903-XCTYG-5-P6 | Preserve collaborative inspectability | Humans must remain able to challenge AI-first architecture decisions | Human-facing artifacts explain causal paths from intent to behavior and expose confidence/uncertainty |

## Adoption / Scope

Applies to Airadne research, architecture exploration, semantic experiments, and future implementation choices when several approaches remain acceptable.

This profile does not automatically adopt Muze library stewardship concerns, package maturity rules, or any project/client-specific constraints not recorded in Airadne context.

## Historical Rationale / Current Uncertainty

Muze culture favors systems that can learn and be corrected: visible assumptions, replaceable boundaries, inspectable behavior, and simple adequate machinery.

Airadne specifically tests whether those preferences change when AI developers rather than human programmers are the primary maintainers. Some human-centered heuristics may need revision if AI context size and model handover become stronger constraints than human familiarity.

## Project-Specific Additions

| ID | Principle | Why it matters | Scope |
|---|---|---|---|
| CUL-20260903-XCTYG-5-A1 | Actively try to falsify compact-semantics claims | The project exists to investigate the hypothesis, not celebrate it | All architecture cycles before commitment to a semantic core |
| CUL-20260903-XCTYG-5-A2 | Treat ordinary code as a serious baseline | A DSL is only useful if it beats a conventional representation on meaningful context, audit, or verification measures | Semantic experiments and design comparisons |

## Tensions / Trade-Offs

Small semantics can conflict with human familiarity. Generated code can conflict with auditability. A custom DSL can improve AI context size while making human review harder. Conventional frameworks can reduce operational risk while importing hidden assumptions and large context surfaces.

Resolve these tensions with evidence from the current cycle, not by default ideology.
