<script lang="ts">
    import { on } from "svelte/events";

    import { TileBoardStyles as styles } from "@thewaver/ss-components";

    import type { TileBoardTileProps } from "./TileBoard.types.js";

    let props: TileBoardTileProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<div
    {@attach props.attachElement}
    {@attach (element) =>
        on(element, "click", () => {
            if (isDisabled) return;

            props.onActivate();
        })}
    id={props.id}
    class={styles.tileBoardTile}
    role="gridcell"
    aria-colindex={props.colIndex}
    aria-label={props.ariaLabel}
    aria-disabled={isDisabled || undefined}
    style:width={`${props.size.width}px`}
    style:height={`${props.size.height}px`}
>
    <div class={styles.tileBoardPaint}>{@render props.renderContent(props.flags)}</div>

    <div
        {@attach props.attachHit}
        class={styles.tileBoardHit}
        style:clip-path={props.clipPath}
        aria-hidden="true"
    ></div>
</div>
