# Coding standards

Rules for code and automation in this repository. The Standards axis of
`/code-review` reads this file on top of its code-smell baseline (the fixed
smell set from Fowler, Refactoring, chapter 3). A rule here overrides the
baseline.

This file started from a shared baseline. It is this repository's own now:
add, change and remove rules here as this repository learns.

## Coding principles

- **Simplicity first: the diff is the minimum that solves the issue.**
  Every parameter, option, hook, abstraction and error handler it adds has
  a caller or an issue requirement today. A single-use abstraction is
  inlined, a case that cannot happen gets no handler, and 200 lines that
  could be 50 are rewritten. Check: the Standards axis names each addition
  that no caller and no requirement uses.

- **Surgical changes: every changed line traces to the issue.** The diff
  matches the style around it, leaves unrelated code as it found it (dead
  code it notices is flagged on the issue), and removes only what its own
  change orphaned. Check: the Standards axis lists each hunk no requirement
  explains, and each deletion of code the change did not orphan.

- **Goal-driven execution: each change starts from a verifiable goal.**
  "Add validation" becomes "tests for invalid inputs, then make them pass".
  Check: the Standards axis confirms that each behaviour the diff adds or
  changes has a test, or a recorded verification, that fails without it.

- **A failing test is fixed in the code, not in its assertion.** A diff
  that loosens an assertion, widens a tolerance, or skips or deletes a test
  carries the issue ruling that allows it; without one, the author asks.
  Check: the Standards axis lists every assertion the diff loosens, skips
  or deletes, with the ruling behind each.

## How a lesson gets here

A lesson goes to the strongest control that can carry it: make the mistake
impossible, then a check that fails the gate, then a helper, then a hook.
Prose here is the last resort, for a judgement call no script can make.

A mistake or incident becomes a rule here, in the same change that fixes
it, only when it is liable to recur (one incident is enough when the same
shape can plainly happen again), generalises beyond its incident, and has a
check the Standards axis can run on every diff or the review loop can
verify from the issue record. Each rule is one bullet: the rule and a
`Check:` clause naming what enforces it; its incident stays on the issue.
When a check comes to carry a rule, the rule's prose leaves this file in
the change that adds the check.

`/retro` proposes new rules from past sessions; each accepted one lands
here.

## Rules

- **Kill a process you spawned by the PID (process id) recorded at its
  spawn, never by name or pattern, and verify by PID.** Check: the
  Standards axis flags any kill of a spawned process not made by its
  recorded PID (`kill` fed by `pgrep` included), and one with no
  verification by PID after it. `kill -0 <pid>` is a liveness probe, not a
  kill.

- **A test or scratch server binds no fixed port outside a range
  recorded on its issue, and its own run tears it down on every exit
  path.** Bind port 0 (the OS picks a free port) or a port in a recorded
  range. Record the port and PID at spawn. Tear the server down on every
  exit path – in shell, a `trap` handler; in runtimes with lifecycle hooks
  or `finally`, those. Check: the Standards axis flags a test or scratch
  server bound to a literal nonzero port, a spawn that does not record
  both port and PID, and a teardown that does not cover every exit path.

- **A hard elapsed-time cap is a bound, not a target.** The
  implementation names its slack as a constant – the margin for process
  overhead the budget's arithmetic cannot count – states the arithmetic of
  the budget beside the constants, and bounds every send and capture
  inside the window; one unbounded call can spend the whole margin. The
  tests pin the near-boundary case, where every step runs just under its
  timeout and the total stays under the cap, and the timed-out case.
  Check: the Standards axis flags a hard elapsed-time cap with no named
  slack constant, no stated budget arithmetic, an unbounded call in the
  window, or no near-boundary test.

- **Scratch work touches only state the run created.** A test, a
  counter-example or a dry run gets its own throwaway git repository, its
  own scratch directory and, where it uses tmux, its own socket (`tmux -L`
  or `tmux -S`); its cleanup acts on those alone. It never runs against
  the worktree under review, a live profile or an inherited session.
  Check: the Standards axis names, for every tmux, git or file operation a
  test or script in the diff runs, the scratch location it acts on.

- **A guard refuses what it cannot read.** A safety check given missing,
  stale, unreadable or unparsable input refuses and says why; its exit
  status reports a failed rollback or clean-up as a failure. A test pins
  each refusal. Check: the Standards axis names, for every guard in the
  diff, its refusal on bad input and the test that pins it.

- **A guard read before a wait is re-read after it, before the action.**
  State that gates an action is read again after every wait between the
  read and the action (a sleep, a poll, a lock), and the action's check
  and anything it records use the fresh value. A re-read that no longer
  passes withholds the action and says why. A test changes the state
  during the wait and pins the withhold. Check: the Standards axis names,
  for every wait the diff adds before a guarded action and every guard
  read the diff adds or moves ahead of a wait, the re-read after it and
  the test that pins it.

- **Across an `await`, re-check what was read before it.** Shared mutable
  state read before an `await` – a module flag, a queue, a lock, a file on
  disk – can be changed by another caller while the function is
  suspended, a second call of the same function included. After the
  `await`, the code re-reads that state, or holds it across the suspension
  (a lock, an in-flight promise a second caller waits on), before it acts
  on or writes from the earlier value. Check: the Standards axis names
  each read of shared state used after an `await` without a re-read, a
  hold, or a stated reason no other caller can change it.

- **A matcher is tested on input taken from the live system.** A regex,
  splitter or parser that reads commands, paths, URLs or log lines gets
  fixtures copied from real samples, and its tests name the forms it
  accepts and refuses: spaces, percent-encoding, abbreviations, comment
  characters, empty fields. Check: the Standards axis names the live
  sample each new or changed matcher's fixtures came from.

- **A changed fact is changed everywhere it is stated.** Before offering,
  grep the tree for every string the diff removes, and change or retire
  every hit that still states the old fact – comments, docstrings and
  docs, not only the cited lines. Check: the Standards axis greps the
  removed strings on the range it reviews and dispositions every hit left
  standing (fixed, or why it stays).

- **A change names what it exposes or triggers outside the diff.** State
  on the issue, and the Standards axis checks: third-party data written to
  a tracked file, commands another machine can now run, hooks a spawned
  process fires, live files a sync or copy overwrites, and callers of a
  changed identifier, flag or behaviour. A changed identifier is any
  function, flag, command or config key whose behaviour the diff changes,
  not only one it renames or removes. Check: before review, the issue
  lists a `git grep` of each changed identifier with every hit
  dispositioned (changed with it, or why it still holds); the Standards
  axis verifies the list and lists each exposure for the diff, or states
  none.

- **A multi-part report keeps a facts register from the start: every
  count, date and verdict is written once there, and each section cites
  the register rather than restating the figure.** Check: the review loop
  flags a count, date or verdict stated in more than one section without
  a register citation, and a correction made in a section but not in the
  register.
