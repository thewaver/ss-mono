<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";

    import PagePaintAreaGroup from "../../../../PageComponents/PaintAreaGroup/PaintAreaGroup.svelte";
    import { TRACKED_CELLS } from "../../SVGGradients.const";
    import type { TrackedGradientExampleProps } from "../../SVGGradients.types";
    import TrackedShape from "./TrackedShape.svelte";

    let props: TrackedGradientExampleProps = $props();
</script>

<PagePaintAreaGroup groupClass={styles.trackedGrid} cellCount={TRACKED_CELLS.length}>
    {#snippet cell(cell)}
        <TrackedShape
            {...props}
            boxClass={styles.trackedCell}
            groupElement={cell.groupElement}
            groupSize={cell.groupSize}
        />
    {/snippet}
</PagePaintAreaGroup>
