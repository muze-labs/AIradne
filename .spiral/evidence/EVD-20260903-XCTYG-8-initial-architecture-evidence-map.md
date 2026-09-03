---
id: EVD-20260903-XCTYG-8
---

# Evidence: Initial Architecture Evidence Map

## Claim Being Examined

Airadne needs enough evidence to choose a first semantic experiment without prematurely committing to a DSL, programming language, Ariadne rewrite, SimplyStore substrate, or conventional web architecture.

This evidence examines whether Ariadne and SimplyStore suggest durable architectural properties for AI-first development, and where those properties remain uncertain or risky.

## Why This Evidence Exists

This evidence satisfies the initial evidence-map request `REQ-20260903-XCTYG-4`.

The project's core hypothesis is that a very small semantic core plus compact domain-specific representations may make software easier for AI agents to understand, modify, verify, and hand over. The project context explicitly requires this hypothesis to be tested rather than assumed.

## Evidence Method

- [ ] Automated test
- [ ] Property/invariant check
- [x] Static analysis
- [ ] Benchmark
- [x] Manual observation
- [ ] Integration exercise
- [x] Other: research synthesis from repository-local historical and design material

## Ariadne Evidence

| Observation | Evidence | Candidate architectural property | Counterpressure / limits | Confidence |
|---|---|---|---|---|
| Ariadne combines content, users/groups, media, multilingual sites, multisite management, and a filesystem-like repository. | `ariadne/README.md:8-14` | A durable system may benefit from one uniform addressable object/content space instead of separate storage, routing, media, and user-management domains. | This could also be monolithic convenience rather than a small semantic core. | Evidenced |
| Ariadne also bundled a browser IDE, debugger, sandboxed templates, workspaces, DTAP support, and import/export. | `ariadne/README.md:16-24` | Development operations can be made part of the same navigable environment rather than external tools only. | Bundling many tools can increase hidden semantic size and operational coupling. | Evidenced |
| Ariadne was explicitly described as a stable system that handles mundane web-app concerns such as SQL, content storage, security, user management, caching, templating, site management, and NLS. | `ariadne/README:7-21` | The useful property may be not "CMS" but "common application concerns are represented once behind stable semantics." | This may optimize human delivery speed more than AI inspectability; the actual semantics may be too large. | Evidenced |
| Ariadne exposes rich objects through simpler projections. FTP `#files#`, `#templates#`, and `#objects#` modes show different aspects of the same object space. | `ariadne/docs/ftp/readme.txt:13-32` | The same semantic object can support multiple task-specific projections without losing identity. | Projection rules become part of the semantic burden. The `#objects#` mode was explicitly unfinished. | Evidenced |
| In FTP `#files#` mode, uploaded files become typed objects through configurable MIME-type mappings. | `ariadne/docs/ftp/readme.txt:36-59` | Object creation can be mediated by context-specific interpretation rules rather than hard-coded endpoint types. | Interpretation rules may become implicit magic unless exposed and testable. | Evidenced |
| In FTP `#templates#` mode, object templates are exposed as files under the object where they are defined, with filename parts encoding local/default, type, template name, and language. | `ariadne/docs/ftp/readme.txt:62-91` | Behavior can be locally attached to objects while remaining inspectable through ordinary tools. | Filename encoding mixes several semantic axes and can confuse users/tools. | Evidenced |
| Ariadne's NLS handling lets object-tree configuration "drip down" to children, including language defaults and template availability. | `ariadne/docs/nls.txt:69-97` | Contextual behavior/configuration inheritance can reduce repetition for tree-structured applications. | The NLS document itself calls the result "a bit complex" while saying the complexity is kept out of templates. | Evidenced |
| Subtypes allow new class names extending default classes and selecting templates for those subtypes. | `ariadne/docs/subtypes.txt:4-30` | Type and behavior specialization can be added locally without replacing the global object model. | Subtype querying had known inconsistency: `implements` did not find subtypes while `type` did. | Evidenced |
| Grant resolution walks parent paths, user grants, group grants, nearest-parent precedence, and modifiers. | `ariadne/lib/objects/ariadne_object.php:948-975` | Authorization may need to be a first-class hierarchical semantic relation, not an afterthought in handlers. | The semantics are nontrivial and could be hard for AI or humans to audit if compressed into a hidden primitive. | Evidenced |
| LDAP objects can appear as Ariadne objects by mapping Ariadne search expressions/properties to LDAP filters/attributes. | `ariadne/docs/ldap.txt:1-14`, `ariadne/docs/ldap.txt:62-116` | Foreign systems can be integrated by adapting them into a uniform object/query space. | Adapter mappings can hide important mismatch between local semantics and external system semantics. | Evidenced |

### Ariadne Interpretation

Ariadne's most plausible durable concept is not its PHP implementation, CMS feature set, or template terminology. The deeper property appears to be:

> A stable, navigable object space where identity, hierarchy, behavior selection, permissions, projections, and external adapters share enough semantics that many application concerns can be expressed locally.

The main warning is that Ariadne also demonstrates how contextual power can become implicit complexity. Acquisition, NLS, template selection, grants, projection modes, and external mappings may reduce local repetition while increasing the semantic load of the interpreter.

## SimplyStore Evidence

| Observation | Evidence | Candidate architectural property | Counterpressure / limits | Confidence |
|---|---|---|---|---|
| SimplyStore presents itself as a radically simpler backend without a database, SQL, GraphQL, or REST, with an API derived from the dataset. | `simplystore/README.md:3` | Data shape can drive API affordances directly, reducing duplicated schema/controller layers. | The README still uses a broad JavaScript query surface, so the effective semantics may remain large. | Evidenced |
| JSONTag adds semantic tags to JSON without requiring a full move to Linked Data/triple stores. | `simplystore/README.md:5`, `simplystore/README.md:131-139` | A transitional representation can add meaning to familiar data structures without adopting a full semantic-web stack. | Partial semantics may create edge cases where neither plain JSON tooling nor RDF tooling fully applies. | Evidenced |
| JavaScript queries run in VM2, and the README warns about known VM2 security issues. | `simplystore/README.md:6-9` | Query behavior is isolated from mutation, but sandbox choice is part of the trusted semantic boundary. | Arbitrary JavaScript query semantics and sandbox risk are strong counterexamples to "small inspectable semantics." | Evidenced |
| Queries can use arbitrary JavaScript APIs but cannot mutate the dataset. | `simplystore/README.md:91-110` | Read-side immutability is a strong simplifier for local reasoning and parallelism. | "Just JavaScript" makes query expressiveness high but semantic surface large. | Evidenced |
| SimplyStore is scoped to in-memory datasets, mostly-read sparse-update use cases, single-machine scale-up, and a possible RDF onramp. | `simplystore/README.md:141-148` | Explicit scope boundaries can keep a storage kernel small and honest. | The architecture may not generalize to larger, distributed, or write-heavy systems. | Evidenced |
| The roadmap records implemented command handling, command log, backup/recovery, unresolved-command startup checks, and access control. | `simplystore/README.md:153-163` | Command log plus reconstruction gives auditability and recovery without a conventional database. | ACID stress testing and safer query isolation remain open. | Evidenced |
| The ACID design separates immutable query data from a single sequential command handler. | `simplystore/design/acid.md:5-25` | A small semantic rule set can preserve atomicity, consistency, isolation, and durability for a constrained workload. | Correctness depends on command semantics, durable write ordering, and recovery details. | Evidenced |
| Command design prefers meaningful domain commands over generic JSON patch because generic patches preserve atomicity but lose intent. | `simplystore/design/commands.md:13-18` | Mutations should preserve semantic intent, not just state diffs. This aligns strongly with causal explanation. | Meaningful command handlers can become opaque code unless their behavior is inspectable and versioned. | Evidenced |
| Query and command APIs may need versioning or transformation as data structures change. | `simplystore/design/commands.md:19-23` | Versioned semantic boundaries matter even in a small system. | A compact model does not remove evolution complexity; it relocates it into transformers/commands. | Evidenced |
| Planned history/workspace support would expose object versions, command causes, workspace branches, and merge/conflict handling. | `simplystore/ROADMAP.md:5-41` | Versioned state and workspace isolation are natural fits for AI handover, reconstruction, and audit. | Merge semantics can become complex; the roadmap even compares workspace integration to rebase, which conflicts with Spiral's preference for preserved causal history when commits are evidence. | Evidenced |

### SimplyStore Interpretation

SimplyStore's most useful Airadne candidates are:

- immutable read views;
- semantic command mutation;
- command logs as causal evidence;
- reconstruction from authoritative state;
- derived indexes;
- explicit durability boundaries;
- scoped storage assumptions.

The main warning is that SimplyStore's current human-developer convenience mechanisms, especially arbitrary JavaScript queries, may work against Airadne's goal of a small inspectable semantic model.

## Likely Durable Concepts

| Candidate concept | Why it looks durable | What must still be tested |
|---|---|---|
| Uniform object/data space | Ariadne and SimplyStore both reduce duplicated app layers by letting identity/data shape drive behavior. | Whether one object/data model can stay small enough for AI inspection while supporting real workflows. |
| Stable identity plus hierarchy | Ariadne paths and SimplyStore object IDs/history both make identity central. | Whether hierarchy is fundamental or merely one useful relation among many. |
| Contextual behavior selection | Ariadne repeatedly benefits from local template/config/type/language behavior. | Whether acquisition-like behavior can be made explicit enough to audit. |
| Semantic commands | SimplyStore shows why meaningful mutations preserve intent better than generic patches. | Whether commands can remain inspectable when their internal behavior grows. |
| Derived projections/indexes | Ariadne projections and SimplyStore indexes suggest generated/read models can be derived from smaller sources. | Whether derivation can be mechanically verified and traced. |
| Hierarchical/ contextual authorization | Ariadne grants show authorization is tied to object location, actor, groups, and behavior. | Whether a small capability model can avoid hidden precedence complexity. |
| Repository-local semantics | Airadne needs DSL/core semantics stored alongside the project for AI handover. | Whether unfamiliar AI agents can learn them cheaply and correctly. |

## Questionable Assumptions And Counterexamples

| Assumption | Counterpressure |
|---|---|
| Smaller syntax means smaller semantics. | Ariadne's compact template/config conventions and SimplyStore's JavaScript queries both hide substantial interpreter/runtime behavior. |
| DSLs improve AI development. | A DSL may require the AI to inspect the DSL grammar, interpreter, generator, runtime, and app source before making a safe change. |
| Ariadne's durable ideas are fundamental. | Some may reflect PHP-era CMS needs, Apache/PHP deployment constraints, or human editor workflows. |
| SimplyStore is a good substrate. | Its in-memory and mostly-read assumptions may constrain Airadne too early; arbitrary JavaScript queries increase semantic scope. |
| Generated code is safe if generated from small meaning. | Trust moves to the generator and derivation checks; if those are complex, generated code may reduce auditability. |
| Human auditability survives AI-first compression. | Dense DSLs may make human review harder even when AI context size improves. |

## Competing Architectural Directions

### Direction A: Object-Space Semantic Kernel

Use a uniform object/data space with stable identity, hierarchy, local behavior selection, semantic commands, derived projections, and contextual authorization.

Why it is attractive:

- Strong continuity with Ariadne's long-lived strengths.
- Makes object identity and local specialization first-class.
- Can make frontend/backend behavior traceable through one semantic space.

Risks:

- Acquisition/config/template lookup can become invisible magic.
- A small kernel may become overloaded with cross-cutting concerns.
- Authorization and context precedence need especially clear semantics.

### Direction B: Commanded Dataspace Kernel

Start from a SimplyStore-like model: immutable read dataspace, semantic commands, command log, reconstruction, derived indexes/views, and explicit integrity boundaries.

Why it is attractive:

- Strong causal explanation from command intent to state transition.
- Read-side immutability simplifies AI reasoning.
- Good fit for audit, replay, and generated derived views.

Risks:

- Object behavior and contextual override may need an additional layer.
- Arbitrary query code weakens semantic compactness.
- Workflows with rich local behavior may push complexity into commands or views.

### Direction C: Declarative Semantics With Generated Runtime

Author meaningful source as declarative object/command/view/capability definitions, then generate optimized runtime code and tests.

Why it is attractive:

- Aligns with the "large generated code, small independent meaning" distinction.
- Could produce explicit machine-readable semantics and causal traces.
- Can compare generated behavior against independent interpreters or fixtures.

Risks:

- This easily becomes language design, which the project explicitly rejects as the starting move.
- The generator and semantic spec may become the real complexity.
- Human review may suffer if the representation is too compressed.

### Direction D: Serious Non-DSL Baseline

Build the same slice in conventional explicit code, likely with ordinary modules, tests, and documentation, while keeping boundaries small and inspectable.

Why it matters:

- It is the necessary control condition.
- If ordinary code is easier for AI/humans to inspect, the core Airadne hypothesis weakens.
- It avoids confusing novelty with evidence.

Risks:

- Conventional framework defaults may import hidden assumptions.
- Boilerplate and scattered behavior may increase context size.

## Highest-Risk Unknowns

1. Does semantic compression reduce total AI inspection burden, or only move burden into interpreter/generator semantics?
2. Can contextual behavior selection be made explicit enough that AI and humans can predict which behavior runs?
3. Can authorization be represented compactly without hiding dangerous precedence rules?
4. Can generated runtime code be verified independently from the generator's own assumptions?
5. Can human reviewers challenge compressed semantics without becoming DSL specialists?
6. Can a different AI model/provider learn the repository-local semantics quickly enough to make handover genuinely better?
7. Is hierarchy a fundamental primitive, or should it be one relation in a more general graph/object model?

## Recommended Minimal Semantic Experiment

Use a small "publication workspace" slice. It should be just large enough to exercise interacting concerns without becoming a product:

- structured objects: site, section, page, asset, user/group;
- identity and hierarchy: pages/assets live under sections;
- relationships: page references asset; section belongs to site;
- query: list visible pages and resolve referenced assets;
- mutation: create page, update page, publish page;
- validation: page requires title/body before publish;
- authorization: viewer/editor/publisher capabilities inherited or specialized by subtree;
- contextual behavior: a section can override page rendering or validation for its subtree;
- frontend/backend interaction: one rendered page or small editor view consumes the resulting behavior.

Compare at least three representations:

1. conventional explicit code baseline;
2. object-space semantic kernel representation;
3. commanded dataspace representation.

Optional later comparison: generated runtime from declarative source, but only after the first three expose what semantics actually matter.

## Experiment Evaluation Criteria

For each representation, measure or record:

- files and concepts an unfamiliar AI must inspect to safely change page publish validation;
- files and concepts needed to explain which render behavior applies to a page;
- whether a human can inspect the authorization and behavior-selection explanation;
- whether tests can independently detect wrong behavior selection, wrong authorization, and invalid generated output;
- where complexity moved: app code, DSL/interpreter, generator, runtime framework, tests, or documentation;
- blast radius of changing one primitive such as hierarchy inheritance or command replay;
- whether ordinary code is simpler for the slice.

## Warning-Profile Disposition

The adopted Airadne warning lens is material here.

- Premature closure: avoid treating Ariadne's object space or SimplyStore's command log as the answer.
- Evidence overreach: repository evidence shows mechanisms exist, not that they are the right primitives.
- Optionality loss: do not choose a substrate or DSL before the experiment can compare it against ordinary code.
- Model closure: be careful making hierarchy mandatory before testing whether graph relations are a better primitive.

## Result

The evidence supports a first experiment comparing representations for the same publication-workspace slice.

It does not support choosing a final architecture yet.

## Failure Cases / Limits

- The Ariadne evidence is repository-local and historical; human interpretation is still needed to distinguish relied-upon concepts from merely present features.
- The SimplyStore evidence reflects an experimental project designed for human developers, not an AI-first substrate.
- No AI handover trial has been run yet.
- No human review of the proposed slice has been completed yet.
- No implementation comparison has been performed yet.

## Evidence Quality

This evidence is useful because it includes direct source references, candidate interpretations, counterpressure, and a non-DSL baseline. It can detect a meaningful failure of the core hypothesis by making ordinary code, hidden interpreter complexity, and human audit cost first-class comparison points.
