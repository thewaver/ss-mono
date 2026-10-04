<script lang="ts">
    import { LIGHT_CATCHER_DEFAULTS, PointerEffectsUtils, LightCatcherStyles as styles } from "@thewaver/ss-components";

    import { PointerTrackerSvelteUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SmootherSvelteUtils } from "../../../Abstracts/Smoother/SmootherSvelte.utils.svelte.js";
    import type { LightCatcherProps } from "./LightCatcher.types.js";

    const NO_STRENGTH = 0;

    let props: LightCatcherProps = $props();

    let element = $state<HTMLDivElement>();

    const isDisabled = $derived(props.isDisabled ?? false);

    const pointer = PointerTrackerSvelteUtils.create(
        () => element ?? undefined,
        () => isDisabled,
        () => props.pointSource,
    );

    const isResting = $derived(
        PointerEffectsUtils.getIsResting(
            isDisabled,
            pointer.getIsPointerPresent(),
            pointer.getReading(),
            props.activeRangePx,
        ),
    );

    const strength = $derived(
        isResting
            ? NO_STRENGTH
            : PointerEffectsUtils.computeEdgeStrength(
                  pointer.getReading(),
                  props.lightRangePx ?? LIGHT_CATCHER_DEFAULTS.lightRangePx,
              ),
    );

    const getEased = SmootherSvelteUtils.create(
        () => [strength],
        () => props.smoothingMs ?? LIGHT_CATCHER_DEFAULTS.smoothingMs,
    );
</script>

<div
    bind:this={element}
    class={styles.lightCatcherRoot}
    style:filter={PointerEffectsUtils.computeLightFilter(getEased()[0], props)}
>
    {@render props.children?.()}
</div>
