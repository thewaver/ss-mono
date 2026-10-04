<script lang="ts">
    import { Wraparound } from "@thewaver/ss-components-svelte";
    import { GRID_CELLS } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

    import type { WraparoundExampleProps } from "../WraparoundPage.types";

    type Props = WraparoundExampleProps;

    let props: Props = $props();
</script>

<div class={styles.smallStage}>
    <Wraparound ariaLabel={"Numbered buttons, repeating in every direction"}>
        {#snippet renderContent()}
            <div class={styles.gridTile}>
                {#each GRID_CELLS as cell (cell)}
                    <button type="button" class={styles.gridCell} onclick={() => props.onPress(cell)}>{cell}</button>
                {/each}
            </div>
        {/snippet}
    </Wraparound>
</div>
