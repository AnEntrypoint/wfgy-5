# Polaris Protocol Skills — Installation & Auto-Update

Three complementary skills from WFGY 5.0 Polaris Protocol are bundled and auto-installed via the `gm` skill. This document explains the installation, discovery, and auto-update mechanism.

## The Three Skills

| Skill | Location | Purpose |
|---|---|---|
| **polaris-goal-compiler** | `~/.claude/skills/polaris-goal-compiler/` | Task specification, atomization, verification gates |
| **fifth-dimension-engine** | `~/.claude/skills/fifth-dimension-engine/` | Problem solving, route generation, structural reasoning |
| **wfgy-method** | `~/.claude/skills/wfgy-method/` | Drift control, decision discipline, bounded recovery |

Plus a master integration guide:
| Guide | Location | Purpose |
|---|---|---|
| **POLARIS-SKILLS-GUIDE** | `skills/POLARIS-SKILLS-GUIDE.md` | DAG, workflows, integration examples |

## Installation

### Option 1: Via gm Skill (Recommended)

When the `gm` skill is installed, all three Polaris skills are automatically installed to:

```
~/.claude/skills/polaris-goal-compiler/
~/.claude/skills/fifth-dimension-engine/
~/.claude/skills/wfgy-method/
```

The `gm` SKILL.md documents that these three skills are bundled and auto-installed. No additional setup needed.

### Option 2: Manual Installation

Copy the three skill directories from this repo:

```bash
cp -r skills/polaris-goal-compiler ~/.claude/skills/
cp -r skills/fifth-dimension-engine ~/.claude/skills/
cp -r skills/wfgy-method ~/.claude/skills/
```

Each skill is self-contained:
- `SKILL.md` — Skill definition with name, description, metadata
- `references/` — Supporting documentation (task-atomization.md, verification-gates.md, etc.)
- Integrated via links in SKILL.md cross-references

## Discovery

Claude Code automatically discovers skills in `~/.claude/skills/` by scanning for directories containing `SKILL.md` with valid frontmatter.

When you invoke `/polaris-goal-compiler`, `/fifth-dimension-engine`, or `/wfgy-method`, Claude Code:
1. Finds the matching directory in `~/.claude/skills/`
2. Reads the frontmatter (name, description, metadata)
3. Loads the full SKILL.md content
4. Makes it available as a callable skill

**Discovery is automatic.** No registration or manifest needed.

## Auto-Update Mechanism

### How It Works

When `gm` is updated (via `bun x gm-plugkit@latest spool` or Claude Code's built-in auto-update):

1. The gm skill in `~/.claude/skills/gm/` is updated
2. The three bundled Polaris skills are updated in place:
   - `~/.claude/skills/polaris-goal-compiler/`
   - `~/.claude/skills/fifth-dimension-engine/`
   - `~/.claude/skills/wfgy-method/`

The update mechanism is **automatic** — no manual steps required.

### Version Pinning

Each skill's frontmatter includes metadata:
```yaml
metadata:
  origin: onestardao-wfgy-5.0-polaris-protocol
  provenance: direct-extraction-from-upstream
```

This allows tracking of where each skill originated and enables selective updates if needed (though the default is to update all three together).

### Update Checking

Claude Code checks for skill updates:
- When the CLI starts
- When a skill is invoked
- During idle periods if configured

The update is applied immediately to the installed directory.

## Directory Structure

### In This Repo (Source)

```
skills/
├── polaris-goal-compiler/
│   ├── SKILL.md
│   └── references/
│       ├── task-atomization.md
│       └── verification-gates.md
├── fifth-dimension-engine/
│   ├── SKILL.md
│   └── references/
│       └── route-structure.md
├── wfgy-method/
│   ├── SKILL.md
│   └── references/
│       ├── failure-modes.md
│       ├── honesty-and-provenance.md
│       ├── lessons-template.md
│       └── wfgy-core-mechanism.md
└── POLARIS-SKILLS-GUIDE.md
```

### In User's Claude Config (Installed)

```
~/.claude/skills/
├── gm/
│   ├── SKILL.md (includes bundled Polaris skills documentation)
│   └── .tessl-plugin/
├── polaris-goal-compiler/        ← Automatically installed with gm
│   ├── SKILL.md
│   └── references/
├── fifth-dimension-engine/       ← Automatically installed with gm
│   ├── SKILL.md
│   └── references/
├── wfgy-method/                  ← Automatically installed with gm
│   ├── SKILL.md
│   └── references/
└── ... (other skills)
```

## Integration

The three skills form a **state-flow DAG**, documented in `POLARIS-SKILLS-GUIDE.md`:

1. **Goal Compiler** specifies work (atomizes, creates gates)
2. **Fifth-Dimension Engine** solves complex atoms
3. **WFGY-Method** keeps reasoning on track

**Integration points:**
- Goal Compiler's **verification gates** become WFGY-Method's **checkpoints**
- WFGY-Method's **ΔS (drift)** detects when engine exploration has drifted
- Engine's **output** is verified against Goal Compiler's **gates**

See `POLARIS-SKILLS-GUIDE.md` for detailed workflows and examples.

## Cross-Repository Consistency

The same three skills exist in two places:

1. **This repo** (`wfgy-5`): Source of truth, used for development and documentation
2. **User's Claude config** (`~/.claude/skills/`): Installed version, used by Claude Code

**Keeping them in sync:**
- Changes to skills in this repo are committed and tracked
- When `gm` is updated, those changes propagate to `~/.claude/skills/`
- No manual syncing needed — auto-update handles it

## Troubleshooting

### Skills Not Discovered

If `/polaris-goal-compiler` doesn't work:

1. **Check installation**:
   ```bash
   ls ~/.claude/skills/polaris-goal-compiler/SKILL.md
   ```

2. **Check frontmatter**:
   ```bash
   head -10 ~/.claude/skills/polaris-goal-compiler/SKILL.md
   ```
   Must have:
   ```yaml
   ---
   name: polaris-goal-compiler
   description: ...
   ---
   ```

3. **Reload Claude Code**: Close and reopen the IDE/terminal

### Stale Skills After Update

If the skills don't update with `gm`:

1. **Force update**:
   ```bash
   bun x gm-plugkit@latest spool
   ```

2. **Manually copy** (if needed):
   ```bash
   rm -rf ~/.claude/skills/polaris-goal-compiler ~/.claude/skills/fifth-dimension-engine
   cp -r skills/polaris-goal-compiler ~/.claude/skills/
   cp -r skills/fifth-dimension-engine ~/.claude/skills/
   ```

3. **Reload Claude Code**

## References

- `POLARIS-SKILLS-GUIDE.md` — Full integration guide, DAG, workflows
- `skills/polaris-goal-compiler/SKILL.md` — Goal Compiler skill definition
- `skills/fifth-dimension-engine/SKILL.md` — Fifth-Dimension Engine skill definition
- `skills/wfgy-method/SKILL.md` — WFGY-Method skill definition
- `~/.claude/skills/gm/SKILL.md` — gm skill (includes bundled skills documentation)
