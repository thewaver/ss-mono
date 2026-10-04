<script lang="ts">
    import { PointerEffectsUtils, SHADOW_CASTER_DEFAULTS, ShadowCasterStyles as styles } from "@thewaver/ss-components";

    import { PointerTrackerSvelteUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SmootherSvelteUtils } from "../../../Abstracts/Smoother/SmootherSvelte.utils.svelte.js";
    import type { ShadowCasterProps } from "./ShadowCaster.types.js";

    let props: ShadowCasterProps = $props();

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

    const getShadow = SmootherSvelteUtils.create(
        () => PointerEffectsUtils.computeShadowTargets(pointer.getReading(), isResting, props),
        () => props.smoothingMs ?? SHADOW_CASTER_DEFAULTS.smoothingMs,
    );
</script>

<div
    bind:this={element}
    class={styles.shadowCasterRoot}
    style:filter={PointerEffectsUtils.computeShadowFilter(getShadow(), props.color)}
>
    {@render props.children?.()}
</div>
