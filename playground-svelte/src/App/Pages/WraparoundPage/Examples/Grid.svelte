<script lang="ts">
    import { Wraparound } from "@thewaver/ss-components-svelte";
    import { GRID_CELLS, NUMBERED_BUTTONS_REPEATING_EVERY_LABEL } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

    import type { WraparoundExampleProps } from "../WraparoundPageSvelte.types";

    type Props = WraparoundExampleProps;

    let props: Props = $props();
</script>

<div class={styles.smallStage}>
    <Wraparound ariaLabel={NUMBERED_BUTTONS_REPEATING_EVERY_LABEL}>
        {#snippet renderContent()}
            <div class={styles.gridTile}>
                {#each GRID_CELLS as cell (cell)}
                    <button type="button" class={styles.gridCell} onclick={() => props.onPress(cell)}>{cell}</button>
                {/each}
            </div>
        {/snippet}
    </Wraparound>
</div>
