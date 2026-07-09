# WFGY 5.0 — Polaris Protocol

## Abstract

Polaris Protocol is the active flagship of WFGY 5.0, a governed protocol layer for building, tuning, verifying, and carrying structured language systems across sessions, tasks, and worlds. It powers the Fifth-Dimension Engine, a problem-solving tool for theorem work, strategy, engineering, and reasoning — solving the Seven Millennium Problems through native Lean proofs without unsupported lemmas.

This paper outlines the core Polaris mechanisms: the Goal Compiler (a human-AI execution protocol), the Fifth-Dimension Engine (the core solver), drift control and decision-gating systems, and the reasoning discipline that makes autonomous multi-step work verifiable, auditable, and recoverable.

## 0. WFGY: The Foundation Beneath Polaris

WFGY is short for Wan Fa Gui Yi — Chinese for "all methods return to one." At its base, WFGY is a portable reasoning layer that attaches to any existing large language model: a symbolic reasoning kernel meant to reduce semantic drift and hallucination across multi-step reasoning. The core mechanisms are a semantic-drift measurement (ΔS = 1 - cos(Goal, Current State)) and four "Big Bang" modules:

- **BBMC** (compare state against goal — detect drift before it compounds)
- **BBPF** (path finder — consider more than one approach before committing to ambiguous decisions)
- **BBCR** (collapse recovery — checkpoint before risky steps, bounded-retry on incoherence, surface rather than confabulate)
- **BBAM** (attention modulation — avoid over-narrow focus by periodically widening back out)

These mechanisms are carried into every later WFGY layer, including Avatar (the persona-and-runtime layer, now archived), ProblemMap (governance), and Polaris Protocol (the current active direction).

Polaris adds:
- **Goal Compiler**: A portable execution protocol for specifying goals and constraints before acting
- **Fifth-Dimension Engine**: A problem solver that lifts targets into higher coordinate systems and returns actionable routes
- **Drift Trend Classifier**: Trajectories over time — convergent (improving), recursive (flat), divergent (getting worse), or chaotic

## 1. The Goal Compiler

The Goal Compiler is a human-AI execution protocol for assistants, agents, and skill workflows. It formalizes the idea that compilation of goals (stating what you're actually trying to accomplish) should happen *before* acting, not after rationalizing what you did.

It works as:
1. State the goal clearly (G)
2. Generate and compare candidate approaches
3. Identify success criteria and failure modes
4. Execute with checkpoints
5. Verify against the original goal

The protocol is distributed as a TXT-based execution constitution — a portable, readable, auditable spec that can run on any large language model.

## 2. The Fifth-Dimension Engine

The Fifth-Dimension Engine is the core problem-solving tool of Polaris. Invoked with **shoot + [your problem]**, it lifts a target into a higher problem-coordinate and returns an inspectable, attackable, expandable route:

- **Route**: The core strategy or path
- **Structure**: Decomposition into subproblems
- **Candidate Lemmas**: Supporting proofs or insights
- **Objections**: What could go wrong
- **Open Debt**: What remains unresolved
- **Next Command**: What to do next

For theorem work: the engine produces native Lean proofs without sorry/admit. For strategy, engineering, or everyday decisions: it produces actionable reasoning chains grounded in first principles.

## 3. Drift Control and Decision-Gating

Polaris operationalizes WFGY's core drift-control discipline:

**ΔS (Semantic Drift)**: Measured as 1 - cos(Goal, Current State), quantifying how far the current work has drifted from the stated goal. Real ΔS requires embeddings (real cosine similarity from a BERT model); qualitative ΔS is a human judgment of "is this drifting?"

**Trend Classification**: Over multiple steps, track whether drift is getting better (convergent), staying flat (recursive), getting worse (divergent), or chaotic. Divergent or chaotic trajectories trigger the BBCR bounded-retry discipline before continuing.

**Bounded Retry**: Before risky or exploratory steps, note what "last known good" looks like. If incoherence is detected, return to the checkpoint, retry at most 2-3 times for the same unresolved tension, then surface the problem rather than loop indefinitely.

## 4. Multilingual and Cross-Session Carry

Like Avatar, Polaris ensures that language systems carry consistently across:
- Session boundaries (same system after a restart)
- Model swaps (same system with a different model)
- Multilingual transpositions (the same anchor, observable in every language)

The protocol specifies how to measure and enforce carry, and when carry has broken.

## 5. The Reasoning Discipline: WFGY Method

`skills/wfgy-method/` is a portable Claude Code Agent Skill implementing the core WFGY reasoning discipline for any project's own multi-step work. It is unrelated to Polaris-the-system and is reusable in any codebase. It covers:

- **BBMC pattern**: State and re-anchor the goal. Ask before each major step: does this still serve the goal?
- **BBPF pattern**: Before ambiguous or high-stakes decisions, consider more than one real approach
- **BBCR pattern**: Checkpoint before risky steps, bounded-retry on incoherence, surface rather than confabulate
- **BBAM pattern**: Periodically ask whether output has narrowed onto one aspect; deliberately widen if so
- **Trend classifier**: Is drift convergent, recursive, divergent, or chaotic?

It explicitly delegates to the calling agent what it cannot compute (real embeddings, real attention statistics), with honest labels for when those tools are or aren't available.

## 6. Difference from Avatar

Avatar (archived) was focused on persona systems — building, tuning, recovering, and multiplying language selves (avatars). It was a deep exploration of how to make persona persistent, editable, and governable.

Polaris Protocol is broader: a general-purpose governing protocol for *any* structured language system (reasoning chains, agent workflows, multi-turn interactions). It trades Avatar's depth on persona for breadth on reasoning and decision-gating. The Fifth-Dimension Engine is a concrete instantiation of this protocol for problem-solving.

Both are real. Avatar remains a valid archived direction. Polaris is the current active flagship, with more use cases and a clearer path to scaled deployment.

## See Also

- `wfgy-core/Polaris/`: Original research and specifications from onestardao/WFGY
- `skills/wfgy-method/`: Portable reasoning discipline skill
- [onestardao/WFGY](https://github.com/onestardao/WFGY): Upstream repository
