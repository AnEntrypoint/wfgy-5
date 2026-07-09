# Polaris Protocol Skills Integration Guide

Three complementary skills work together to handle complex, multi-step reasoning work. This guide shows how they integrate.

## The Three Skills

| Skill | Role | When to Use |
|---|---|---|
| **Polaris Goal Compiler** | Task specification, atomization, verification | Before starting any complex work |
| **Fifth-Dimension Engine** | Problem solving, route generation, structural reasoning | For complex problems that need structured exploration |
| **WFGY-Method** | Drift control, decision discipline, bounded recovery | Throughout all work to stay aligned with goals |

## The Integration DAG

```
                    START: Complex Problem
                           │
                           ▼
                  Use Goal Compiler
              (atomize, specify gates,
               claim ceilings, dependencies)
                           │
                    ┌──────┴──────┐
                    ▼             ▼
            For each atom:    Finished?
          Need structure?      │
            │   │              └─→ [DONE]
            │   │
    ┌───────┴───┴─────────┐
    ▼                     ▼
  YES                    NO
   │                      │
   │              Execute directly
   │              │
   │              ▼
   │         Goal Compiler's
   │         Verification Gate
   │              │
   │              └─→ Move to next atom
   │
   ▼
Use Fifth-Dimension Engine
(produce route/structure)
   │
   ├─→ While inspecting output,
   │   apply WFGY-Method:
   │   - Check drift (ΔS)
   │   - Consider alternatives (BBPF)
   │   - Checkpoint risky steps (BBCR)
   │   - Avoid narrow focus (BBAM)
   │   - Track trajectory (trend classifier)
   │
   ▼
Verify against Goal Compiler's gate
   │
   └─→ Move to next atom, repeat
```

## State Machine View

Each skill has a clear input/output contract:

### Goal Compiler

```
Input:  Goal (one sentence) + problem description
Output: 
  - Task atoms (list)
  - Dependencies (DAG)
  - Active/blocked distinction
  - Verification gates (one per atom)
  - Claim ceilings (honesty bounds)

Precondition: Goal must be stated clearly
Postcondition: Before any execution starts
```

### Fifth-Dimension Engine

```
Input:  Well-specified problem atom + goal context
Output:
  - Route (strategy/path)
  - Structure (decomposition)
  - Candidate lemmas (supporting evidence)
  - Objections (what could be wrong)
  - Open debt (unresolved items)
  - Next command (what to do next)

Precondition: Goal Compiler has specified the atom clearly
Postcondition: Can be inspected, attacked, expanded
```

### WFGY-Method

```
Input:  Work in progress (could be from engine, or routine execution)
Output:
  - Drift measurement (ΔS, qualitative or real)
  - Decision structure (consider alternatives before committing)
  - Checkpoint state (for bounded retry)
  - Trajectory classification (convergent/recursive/divergent/chaotic)
  - Lessons learned (recorded to project's .wfgy/lessons.md)

Precondition: Goal is stated (usually from Goal Compiler)
Postcondition: Work stays aligned, decisions are deliberate, errors are bounded
```

## Typical Workflows

### Workflow 1: Large Project Planning

Goal: "Build a new microservice for payment processing."

1. **Goal Compiler**
   ```
   Atoms:
   - A1: Research payment APIs and compliance requirements (1-2 days)
   - A2: Design microservice interface and data model (1-2 days)
   - A3: Implement core payment routing (3-5 days)
   - A4: Implement error handling and recovery (2-3 days)
   - A5: Write integration tests (2-3 days)
   - A6: Deploy to staging and verify end-to-end (1 day)
   
   Verification gates:
   - A1 gate: Have all compliance requirements been identified?
   - A2 gate: Is the interface sufficient for known integrations?
   - A3 gate: Does routing pass all known payment paths?
   - A4 gate: Does error recovery not lose transactions?
   - A5 gate: Do tests cover >95% of code paths?
   - A6 gate: Does end-to-end payment flow work?
   ```

2. **A1 Execution** (routine): Execute, verify against gate → DONE

3. **A2 Execution** (complex):
   - Use Fifth-Dimension Engine: "shoot + design a payment microservice interface given these compliance requirements"
   - Produces: route with candidate architectures, tradeoffs, open questions
   - Apply WFGY-Method while inspecting: "Is this still about payment processing, or have we drifted into general API design?"

4. **A3-A6**: Similar — use engine for complex atoms, WFGY-Method to stay on track

5. **Final verification**: Goal Compiler's end-to-end gate confirms the whole system works

### Workflow 2: Research Question

Goal: "Understand why distributed consensus algorithms have the tradeoffs they do."

1. **Goal Compiler** atomizes:
   - A1: Survey existing consensus algorithms (Raft, PBFT, Nakamoto, etc.)
   - A2: Extract key design choices in each
   - A3: Map each choice to resulting tradeoff
   - A4: Synthesize patterns — are there fundamental limits?

2. **A1-A2**: Mostly routine

3. **A3** (the complex part):
   - Use Fifth-Dimension Engine: "shoot + why do consensus algorithms face a safety-liveness-cost tradeoff?"
   - Produces: structural reasoning with candidate theoretical bounds, open questions

4. **Apply WFGY-Method**: "As we explore these bounds, are we still answering the original question, or getting lost in formal theory?"

5. **A4 synthesis**: Use engine output to drive the pattern extraction

6. **Verification**: Did we answer the original question?

### Workflow 3: Decision-Making

Goal: "Decide whether to join this startup as CTO."

1. **Goal Compiler** atomizes the decision:
   - A1: Understand the startup (market, product, traction, team)
   - A2: Understand the CTO role (scope, constraints, success criteria)
   - A3: Assess personal fit (skills, risk tolerance, life stage)
   - A4: Compare to alternatives (stay in current role, join other startups)

2. **A1-A3**: Fact-gathering and introspection

3. **A4** (the complex decision):
   - Use Fifth-Dimension Engine: "shoot + should I join this startup as CTO given these factors?"
   - Produces: route through the decision space, candidate paths, objections to each

4. **Apply WFGY-Method throughout**: "As we explore this decision, are we still optimizing for the same criteria, or have priorities shifted?"

5. **Verification gate**: Can you state the decision and its reasoning concisely?

## When to Skip Steps

### Skip Goal Compiler If:
- The task is genuinely trivial (single step, well-known)
- You've already got clear atoms (you structured it yourself)
- The goal is extremely obvious (everyone already knows what "fix the bug" means)

### Skip Fifth-Dimension Engine If:
- The problem is routine (you've solved similar problems before)
- You need speed over depth
- The task has a well-known, proven solution

### Skip WFGY-Method If:
- The task is so trivial that drift is impossible
- You're working on something you've done exactly before
- The cost of applying the discipline exceeds the cost of potential drift

**Note**: Most complex work benefits from all three. The overhead is worthwhile.

## Dependencies and Ordering

**Required order**:
1. Goal Compiler (must come first — clarifies what you're doing)
2. Then for each atom: decide if Fifth-Dimension Engine + WFGY-Method apply
3. Use WFGY-Method throughout (lightweight, applies everywhere)

**No circular dependencies**: The three skills form a DAG, not a cycle.

## Integration Points

### Goal Compiler ↔ WFGY-Method

- Goal Compiler's **verification gates** become WFGY-Method's **checkpoints for bounded retry**
- WFGY-Method's **ΔS (drift)** reveals when Goal Compiler's atoms have drifted from their spec
- Together: "Are we still solving the problem we said we were solving?"

### Fifth-Dimension Engine ↔ WFGY-Method

- Engine's **output route** needs WFGY-Method's **drift control** while exploring
- WFGY-Method's **decision discipline (BBPF)** applies to choosing between engine's candidate paths
- Together: "As we explore the solution space, are we still on track?"

### Fifth-Dimension Engine ↔ Goal Compiler

- Goal Compiler **specifies the problem atoms** that get shot to the engine
- Engine's **output** gets verified against Goal Compiler's **verification gates**
- Together: "Is the engine's output actually solving the problem we specified?"

## Mismatch Detection

If you notice:

- **Engine output doesn't match goal specification**: Re-run Goal Compiler to clarify the problem, or re-spec the engine prompt.
- **Drift detected by WFGY-Method while using engine**: Return to checkpoint and retry with tighter scope.
- **Atom can't be completed**: Goal Compiler's atomization was too coarse. Re-break the atom.
- **Many atoms fail verification**: Original goal was underspecified. Return to Goal Compiler and re-specify.

## References

- `skills/polaris-goal-compiler/SKILL.md` — task specification details
- `skills/fifth-dimension-engine/SKILL.md` — problem-solving mechanics
- `skills/wfgy-method/SKILL.md` — drift control and reasoning discipline
- `wfgy-core/Polaris/` — original research and evidence from onestardao/WFGY

## Quick Start

**You have a complex problem and don't know where to start:**

1. Write your goal in one sentence.
2. Read `skills/polaris-goal-compiler/SKILL.md` (5 min).
3. Ask an AI: "Compile my goal into task atoms, dependencies, verification gates, and claim ceilings."
4. Review the output.
5. For complex atoms, ask: "Use Fifth-Dimension Engine to produce a route for [this atom]."
6. While reading the route, apply WFGY-Method: ask yourself if you're still on track.
7. Verify each atom against Goal Compiler's gate.
8. Move to the next atom.

Done.
