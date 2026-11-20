# Decisions: `MultiSelect`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `MultiSelect`, `Checkbox` and `Toggle`: Docs pages on the settled patterns

**MultiSelect**: Basic with Error and Disabled; groups and a query, where the example drops groups the query emptied;
clearing every pick, with a last-change line. Its intro points at Select's page instead of repeating that groups, a
query and loading on demand work the same. **Checkbox**: Basic with Error and Disabled; mixed; refusing a change (one
of two boxes must stay on); decoration; the tooltip; naming by a Label. **Toggle**: the same less refusing, and its
mixed section says that a mixed toggle reads as a mixed checkbox, since a switch cannot say "mixed".

**A control's decoration is shown on its Docs page** — the user's call: Checkbox and Toggle showing
`renderDecoration` meant Button should too, since all three take it through the shared wrapper. Button's Examples page
then went entirely, also the user's call: Decorated and Hold to repeat (the counter) moved into Docs as sections, and
Pending and Copy were dropped. Checkbox and Toggle each gained a "Named by a Label" section, as the text fields have.

**Radio**: Basic with Error and Disabled; right to left; segmented; a rating; bent into an arc; decoration; a
disabled option, where Medium is off and a Reachable when disabled knob brings back its tooltip. No Label section: each
radio shows its own text and the group takes the name.
