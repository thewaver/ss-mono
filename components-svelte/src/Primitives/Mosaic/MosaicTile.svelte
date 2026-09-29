<script lang="ts">
    import { untrack } from "svelte";

    import { type MosaicItemState, MosaicUtils, MosaicStyles as styles } from "@thewaver/ss-components";
    import { Rect } from "@thewaver/ss-utils";

    import { toStyle } from "../../Utils/styleUtils.js";
    import type { MosaicTileProps } from "./Mosaic.types.js";

    const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

    let props: MosaicTileProps = $props();

    let tile = $state<HTMLDivElement>();
    let isFocusVisible = $state(false);

    let glide: Animation | undefined;
    let shownRect: Rect | undefined;

    const isPlaced = $derived(props.rect !== undefined);
    const rect = $derived(props.rect ?? EMPTY_RECT);

    $effect(() => {
        const to = rect;
        const isShown = isPlaced;
        const element = tile;

        untrack(() => {
            const from = shownRect;

            if (from && isShown && Rect.isSame(from, to)) return;

            shownRect = isShown ? to : undefined;

            if (!element) return;

            if (from === undefined || !isShown) {
                glide?.cancel();
                glide = undefined;

                return;
            }

            glide = MosaicUtils.glideTile({
                element,
                glide,
                from,
                to,
                isSized: props.isItemSized,
                durationMs: props.glideDurationMs,
                isRepack: props.isRepack,
            });
        });
    });

    $effect(() => () => glide?.cancel());

    const itemState: MosaicItemState = $derived({
        index: props.index,
        readingIndex: props.readingIndex,
        itemCount: props.itemCount,
        rect,
        isFocusVisible,
    });
</script>

<div
    bind:this={tile}
    class={[styles.mosaicItem, props.isItemSized && styles.mosaicSizedItem]}
    style={toStyle(MosaicUtils.computeTileStyle(rect, isPlaced, props.isItemSized))}
    role={props.isWalked ? "listitem" : undefined}
>
    {#if props.isWalked}
        <div
            {@attach props.attachButton}
            class={styles.mosaicTileButton}
            role="button"
            tabindex={props.isTabStop ? 0 : -1}
            onfocus={(e) => {
                props.onFocusSlot();
                isFocusVisible = e.currentTarget.matches(":focus-visible");
            }}
            onkeydown={(e) => {
                isFocusVisible = e.currentTarget.matches(":focus-visible");
            }}
            onblur={() => {
                isFocusVisible = false;
            }}
            onclick={() => {
                props.onFocusSlot();
                props.onActivate(props.index);
            }}
        >
            {@render props.renderItem(props.index, itemState)}
        </div>
    {:else}
        {@render props.renderItem(props.index, itemState)}
    {/if}
</div>
