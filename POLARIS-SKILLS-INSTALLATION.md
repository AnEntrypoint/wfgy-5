# Polaris Protocol Skills — Installation & Distribution

The WFGY 5.0 Polaris Protocol ships as a **tree of four skills**: one discoverable root plus three children. They are distributed via the `gm` harness repo (so they install alongside `gm`) and developed in this repo (`wfgy-5`).

## The Skill Tree

| Skill | Role | When to dispatch |
|---|---|---|
| **polaris-protocol** (root) | Tree root + state machine; wires the children together | First — to run a task through the protocol |
| **polaris-goal-compiler** | COMPILE — task specification, atomization, verification gates, claim ceilings | Before execution / when a goal is unclear |
| **fifth-dimension-engine** | SHOOT — problem solving, route generation, structural reasoning | For complex atoms that need structured reasoning |
| **wfgy-method** | DRIFT CONTROL — drift measurement, decision discipline, bounded recovery | Throughout, at every state |

Plus two integration docs in this repo:
| Doc | Location | Purpose |
|---|---|---|
| **POLARIS-SKILLS-GUIDE** | `skills/POLARIS-SKILLS-GUIDE.md` | DAG, state machine, workflows, integration examples |
| **This doc** | `POLARIS-SKILLS-INSTALLATION.md` | Installation & distribution |

## Installation

### Option 1: Via the gm harness (recommended)

The `gm` harness repo bundles the Polaris skills under `skills/`, so they are installed together with `gm` into the assistant's skill directory (e.g. `~/.claude/skills/`). When `gm` is present, the four Polaris skills are available alongside it — no separate setup.

### Option 2: Manual installation

Copy the four skill directories from this repo (or from the `gm` repo's `skills/`):

```bash
cp -r skills/polaris-protocol        ~/.claude/skills/
cp -r skills/polaris-goal-compiler   ~/.claude/skills/
cp -r skills/fifth-dimension-engine   ~/.claude/skills/
cp -r skills/wfgy-method             ~/.claude/skills/
```

Each skill is self-contained:
- `SKILL.md` — skill definition with `name`, `description`, `metadata`
- `references/` — supporting documentation
- Integrated via explicit cross-references and the root's state machine

## Discovery

Assistants discover skills by scanning for directories containing a `SKILL.md` with valid frontmatter (`name`, `description`). Invoking `/polaris-protocol`, `/polaris-goal-compiler`, `/fifth-dimension-engine`, or `/wfgy-method` loads the matching skill. **Discovery is automatic** — no registration or manifest needed (the `gm` plugin scans its own directory; the Polaris skills live as sibling skill directories).

## Provenance & honesty

Every Polaris skill's frontmatter carries:

```yaml
metadata:
  origin: onestardao-wfgy-5.0-polaris-protocol
  provenance: adapted-and-honest-reimplementation-not-verbatim
```

These skills are **adaptations** of the public WFGY 5.0 Polaris Protocol components (the upstream Goal Compiler is released ChatGPT-first; the Fifth-Dimension Engine is the current main product surface). They are not verbatim extractions and do not reproduce upstream's private engine or any demo-benchmark output. `wfgy-method` additionally adapts WFGY's core drift-control mechanism.

## Directory structure (source, this repo)

```
skills/
├── polaris-protocol/              ← tree root (state machine)
│   └── SKILL.md
├── polaris-goal-compiler/
│   ├── SKILL.md
│   └── references/
│       ├── task-atomization.md
│       ├── verification-gates.md
│       └── claim-ceiling-examples.md
├── fifth-dimension-engine/
│   ├── SKILL.md
│   └── references/
│       ├── route-structure.md
│       ├── seven-millennium-problems.md
│       ├── research-kernel-extraction.md
│       └── route-inspection-guide.md
├── wfgy-method/
│   ├── SKILL.md
│   └── references/
│       ├── failure-modes.md
│       ├── honesty-and-provenance.md
│       ├── lessons-template.md
│       └── wfgy-core-mechanism.md
└── POLARIS-SKILLS-GUIDE.md
```

## How the tree behaves (state machine)

The tree is not just a folder of related skills — it behaves like a state machine. `polaris-protocol` defines the states (`UNCOMPILED → COMPILED → SHOOTING/EXECUTING → VERIFYING → CLOSED`) and the explicit transitions between them, each transition being a dispatch to a child skill. See `skills/polaris-protocol/SKILL.md` and `skills/POLARIS-SKILLS-GUIDE.md` for the full machine and workflows.

## Keeping the two repos in sync

The same four skills live in two places:
1. **This repo (`wfgy-5`)** — source of truth for development and documentation.
2. **The `gm` harness repo (`..\\gm`)** — bundled copy, installed alongside `gm`.

When you improve a skill here, copy the changed `skills/<name>/` directory into the `gm` repo's `skills/` so the installed version stays current. No manifest edit is required; discovery is directory-based.

## Troubleshooting

If a skill is not discovered:
1. Confirm the directory contains `SKILL.md` with valid `name`/`description` frontmatter.
2. Reload the assistant.

## References

- `skills/polaris-protocol/SKILL.md` — tree root + state machine
- `skills/POLARIS-SKILLS-GUIDE.md` — full integration guide, DAG, workflows
- `skills/polaris-goal-compiler/SKILL.md` — Goal Compiler skill
- `skills/fifth-dimension-engine/SKILL.md` — Fifth-Dimension Engine skill
- `skills/wfgy-method/SKILL.md` — WFGY-Method skill
