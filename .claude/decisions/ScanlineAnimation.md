# Decisions: `ScanlineAnimation`

Part of the decisions record. Every heading is indexed in `.claude/decisions.md`.

### `ScanlineAnimation`: `orientation`, and why the defs are not transposed

**`orientation` picks rows or columns, `horizontal` by default.** `vertical` hands CellAnimation `{ row: 1, col: lineCount }`. The evaluation defs stay the grid's own, so a vertical line's place is `pos.col`. Transposing them would make the index agree with the rows while every transform still moved along the screen's own axes, so the samples would be no more correct on columns, only harder to reason about. The shipped keyframe samples are row-shaped (`Horizontal*`) and have no column versions.
