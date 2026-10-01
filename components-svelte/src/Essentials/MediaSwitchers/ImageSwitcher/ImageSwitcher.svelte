<script lang="ts">
    import { untrack } from "svelte";

    import {
        IMAGE_SWITCHER_DEFAULTS,
        ImageSwitcherUtils,
        ImageSwitcherStyles as styles,
    } from "@thewaver/ss-components";

    import { readStore } from "../../../Utils/storeUtils.js";
    import type { ImageSwitcherProps } from "./ImageSwitcher.types.js";

    let props: ImageSwitcherProps = $props();

    const switcher = ImageSwitcherUtils.createSwitcher();
    const getSwitcherState = readStore(switcher.store);

    const layers = $derived(ImageSwitcherUtils.getLayers(getSwitcherState()));
    const transitionDurationMs = $derived(props.transitionDurationMs ?? IMAGE_SWITCHER_DEFAULTS.transitionDurationMs);

    $effect(() => {
        const src = props.src;

        return untrack(() =>
            switcher.show(src, {
                onLoad: function (e) {
                    return props.onLoad?.call(this, e);
                },
                onError: (e) => props.onError?.(e),
            }),
        );
    });
</script>

<div class={styles.imageSwitcherRoot}>
    {#each layers as layer}
        <img
            class={styles.imageSwitcherImage}
            style:opacity={layer.isShown ? 1 : 0}
            style:transition-duration={`${transitionDurationMs}ms`}
            style:visibility={layer.src ? undefined : "hidden"}
            src={layer.src}
            alt={props.alt ?? ""}
        />
    {/each}
</div>
