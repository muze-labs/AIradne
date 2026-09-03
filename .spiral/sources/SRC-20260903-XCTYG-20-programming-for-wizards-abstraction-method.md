---
id: SRC-20260903-XCTYG-20
---

# Source: Programming For Wizards Abstraction Method

## Source Kind

External human-authored book chapters, referenced from GitHub and locally inspected during cycle `CYC-20260903-XCTYG-19`.

## Origin / Locator

Human-provided source in conversation on 2026-09-03:

```text
https://github.com/poef/programming-for-wizards/tree/main/content/chapters
```

Pinned source revision used for this artifact:

```text
6ff682bf129ad178eaae44e85e9e1cf93dc4da35
```

Pinned chapter tree:

```text
https://github.com/poef/programming-for-wizards/tree/6ff682bf129ad178eaae44e85e9e1cf93dc4da35/content/chapters
```

## Chapters Inspected For This Cycle

The cycle inspected the chapter list and read the chapters most directly relevant to abstraction, language design, boundaries, object design, architecture, and graph-shaped data:

- Chapter 08, `programming-languages-are-for-humans`: programming language design as a human communication and learning-cost problem.
- Chapter 09, `every-program-contains-a-language`: every program grows a local dialect; names and API choices become a project language whether or not this is acknowledged.
- Chapter 10, `code-exhibit-extending-js-with-jaqt`: small embedded languages can begin as ordinary data shapes and a few named operations before any parser or new syntax exists.
- Chapter 11, `knitted-castle`: complexity comes from assumptions crossing boundaries; reusable parts are made by cutting assumptions, not merely by packaging code.
- Chapter 12, `objects-binding-data-behavior-and-time`: object boundaries are useful when they hide real mess and expose a smaller language, but hidden dependencies and premature binding make objects traps.
- Chapter 13, `architecture-arches-pyramids-and-change`: architecture should arrange change pressure and survive wrong choices; small languages are architectural tools only when their vocabulary fits the problem.
- Chapter 15, `web-as-data`: graph-shaped facts, identity, and shared meaning require names that survive one application; formats alone do not provide interoperability.

## Observations Retained

### Language Cost

Programming languages are for humans. A new abstraction is therefore also a vocabulary choice. It helps insiders only if it lets them say the problem more directly, and it taxes outsiders by requiring them to learn new words.

### Every Program Already Has A Language

Functions, classes, fields, data shapes, tests, and conventions form a local dialect inside the host programming language. The choice is not whether Airadne has a language; the choice is whether that language is conscious, small, inspectable, and fitted to the problem.

### Start With Small Spells

The JAQT chapter demonstrates a method for growing a little language inside JavaScript using ordinary object shapes, functions, and a few names. The methodological point for Airadne is to avoid jumping to parser design. Let names earn themselves by reducing real local complexity.

### Boundaries Are Assumption Filters

The book treats boundaries as places where assumptions stop. A boundary is not clean because code is in a separate file or package. It is clean when a caller no longer needs to know accidental choices behind it, and the callee no longer needs to know accidental choices outside it.

### Find Boundaries From Change Pressure

A potential boundary appears when two things change for different reasons, when one part chooses a dependency that another part merely uses, or when bridge code exists only because two concepts need to meet. Drawing boxes before observing those pressures risks making arbitrary architecture.

### Shell And Core

Stable rules should be kept away from volatile machinery such as files, databases, networks, frameworks, clocks, and random sources. The shell may choose dependencies and adapt external shape; the core should accept plain data and expose a small language.

### Object Boundaries Are Conditional

Objects can help when they bind data and behavior at the right time and expose a smaller language. They hurt when they hide dependencies, bind decisions too early, or become places where unrelated change reasons accumulate.

### Architecture Survives Wrongness

Architecture is not a proof that the current model is right. It should make it cheap to replace a wrong piece, move data, and grow the language without invalidating old sentences.

### Graph Facts Need Named Meaning

Graph-shaped data helps avoid false hierarchy, but facts are not enough. Relation names and their meanings become social and architectural commitments. A graph kernel must keep relation meaning visible instead of hiding it behind generic traversal cleverness.

## Relevance To Airadne

This source directly informs the next graph-focused cycle:

- It cautions against replacing `ObjectSpace` with many clever helpers that create a private dialect without payoff.
- It supports looking for primitives at real pressure lines: identity/object storage, relation facts, indexes, traversal, projection, domain rules, and explanation.
- It reinforces the accepted project constraint that hierarchy is a projection, not identity.
- It argues for plain data and host-language tests before inventing a syntax or runtime language.

## Primary Evidence Availability

Referenced externally and locally inspected during the cycle. The exact inspected upstream revision is pinned above.

## Provenance Confidence

Explicit. The source URL was supplied by the human and the upstream commit was verified with `git ls-remote` on 2026-09-03.

## Limitations / Uncertainty

This artifact preserves the book input used by the cycle. It is not yet an Airadne design decision. The derived understanding and design artifacts must still interpret and apply it, and human review may correct that interpretation.
