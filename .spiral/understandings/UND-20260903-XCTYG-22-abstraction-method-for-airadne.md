---
id: UND-20260903-XCTYG-22
---

# Understanding: Abstraction Method For Airadne

## Role

This artifact interprets the _Programming for Wizards_ source for Airadne's current design problem: how to get to correct and clean abstractions before decomposing the graph `ObjectSpace`.

## Interpreted Source

- `SRC-20260903-XCTYG-20`: _Programming for Wizards_ abstraction-method source.
- `FBK-20260903-XCTYG-18`: human feedback that `ObjectSpace` is not yet compositional.

## Core Interpretation

The book's practical method is not "find nouns and make classes" or "make a DSL." It is closer to:

1. Notice the words the program is already forcing people and agents to learn.
2. Find where assumptions cross boundaries and make unrelated things change together.
3. Make the smallest language that lets the problem be stated more directly.
4. Keep the language visible as plain names, data shapes, and tests until syntax earns its cost.
5. Place dependencies and binding decisions where they are cheapest to change.
6. Treat architecture as protection against being wrong.

For Airadne, a clean abstraction is therefore not merely a reusable helper. It is a boundary with a clear bargain:

- what concepts the caller may rely on;
- what accidental choices the caller is spared from knowing;
- what facts or rules remain inspectable as data;
- how the abstraction can be tested, replaced, or falsified.

## Consequences For Airadne

### New Words Must Earn Their Cost

Every primitive introduced into Airadne becomes part of the project language. A primitive is justified only when it removes repeated explanatory burden or prevents a known class of mistakes. A shorter implementation is not enough.

### Data Shape Comes Before Syntax

The project should continue using plain JavaScript data and tests for this slice. If a DSL eventually appears, it should be because repeated data shapes and names have stabilized, not because compact syntax is attractive.

### Graph Is Not The Whole Abstraction

Graph facts help with identity and non-hierarchical relations, but a generic graph layer does not explain publication behavior by itself. Meaning lives in relation names, rule names, projection definitions, validation rules, authorization rules, and explanation records.

### Hierarchy Remains Projection

The accepted correction still governs this cycle: containment can support navigation and scope projection, but object identity must remain stable and independent of containment path.

### Boundaries Come From Change Pressure

The current `ObjectSpace` bundles responsibilities that have different reasons to change:

- object lookup and object type indexing;
- relation fact storage;
- relation indexing;
- mutation/reference validation;
- generic graph traversal;
- containment-specific projection traversal;
- workspace and authorization scope tracing;
- publication behavior selection and validation.

Those should not all live behind one concept if the project wants evidence for a small semantic core.

### Domain Rules Must Not Sink Into The Kernel

Authorization, validation, behavior precedence, and workspace semantics are publication-domain rules in the current slice. They should use graph primitives but should not become hidden graph-kernel behavior.

### Explanation Is A First-Class Boundary

An explanation is not just a string attached at the end. It is part of the interface by which a human or AI audits causality. Trace records should remain plain data and should distinguish:

- facts consulted;
- traversal path used;
- rule that made a decision;
- candidate rules rejected;
- final decision.

### Replaceability Is Evidence

The decomposition is only meaningful if one primitive can be tested or replaced without rereading the whole publication application. A successful cycle should make at least one boundary independently falsifiable.

## Current ObjectSpace Diagnosis

The existing `ObjectSpace` is useful as a baseline, but it is not clean enough to carry the full hypothesis.

It currently says too many things:

- "An object is stored in this mutable object table."
- "Object type membership is a cached set."
- "A relation is an edge with `type`, `from`, and optional `to`."
- "Relation indexes are rebuilt and updated here."
- "Unknown objects are rejected during mutation."
- "Containment traversal is breadth-first."
- "Containment ancestry is a graph operation."
- "Publication-specific scope explanations can ask the graph for paths."

Some of those are graph-kernel commitments. Some are projection commitments. Some are domain rules. Some are implementation shortcuts.

## Working Definition

For the next implementation step, an Airadne primitive should be:

- small enough to understand without the publication domain;
- named in the problem language rather than in accidental implementation language;
- expressible through plain input and output data;
- independently testable;
- replaceable without changing accepted publication behavior;
- explicit about what assumptions it does and does not own.

## Open Questions

- Is `ObjectSpace` still a useful facade after decomposition, or should the domain layer compose primitives directly?
- Should relation facts stay as current fixture edge objects, or should the graph kernel normalize them into a more explicit `Fact` shape?
- Should traces be built by each domain rule for now, or should traversal primitives produce trace segments that domain rules assemble?
- Which primitive is the cheapest falsification target: relation indexing, traversal, projection, or explanation?

## Confidence

Medium. The book source gives strong method-level guidance, and the current code provides clear pressure points. The exact decomposition still needs human review because naming the primitives is a language-design decision, not a mechanical refactor.
