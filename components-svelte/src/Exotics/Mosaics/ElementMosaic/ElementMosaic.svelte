<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";
    import { SvelteMap } from "svelte/reactivity";

    import { type MosaicItemState, MosaicUtils, ElementMosaicStyles as styles } from "@thewaver/ss-components";
    import type { Size2d } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import Mosaic from "../../../Primitives/Mosaic/Mosaic.svelte";
    import type { ElementMosaicProps } from "./ElementMosaic.types.js";

    const EMPTY_SIZE: Size2d = { width: 0, height: 0 };

    let props: ElementMosaicProps<T> = $props();

    const elementsByIndex = new SvelteMap<number, HTMLElement>();

    const itemCount = $derived(props.items.length);

    const itemElements = $derived(Array.from({ length: itemCount }, (_, index) => elementsByIndex.get(index)));

    const getMeasuredSizes = ElementObserverSvelteUtils.createBorderBoxSizeListObserver(() => itemElements);

    const sizes = $derived(Array.from({ length: itemCount }, (_, index) => getMeasuredSizes()[index] ?? EMPTY_SIZE));

    const attachItem =
        (index: number): Attachment<HTMLElement> =>
        (element) => {
            untrack(() => elementsByIndex.set(index, element));

            return () => {
                untrack(() => {
                    if (elementsByIndex.get(index) === element) elementsByIndex.delete(index);
                });
            };
        };
</script>

<Mosaic
    sizeAnchor={props.sizeAnchor}
    gap={props.gap}
    transitionDurationMs={props.transitionDurationMs}
    {sizes}
    keys={props.items}
    isItemSized={false}
    computePlacements={MosaicUtils.packFixed}
    ariaLabel={props.ariaLabel}
    onActivate={props.onActivate}
>
    {#snippet renderItem(index: number, state: MosaicItemState)}
        <div {@attach attachItem(index)} class={styles.elementMosaicItem}>
            {@render props.renderItem(props.items[index], state)}
        </div>
    {/snippet}
</Mosaic>
