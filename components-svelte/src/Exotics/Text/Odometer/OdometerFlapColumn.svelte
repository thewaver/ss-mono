<script lang="ts">
    import { untrack } from "svelte";

    import {
        type OdometerFlapLeaf,
        OdometerUtils,
        type SpineSide,
        SpineUtils,
        OdometerStyles as styles,
    } from "@thewaver/ss-components";

    import Spine from "../../../Primitives/Spine/Spine.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import type { OdometerFlapColumnProps } from "./Odometer.types.js";

    const HIDDEN_FACE = { ariaLabel: "", isHidden: true };

    let props: OdometerFlapColumnProps = $props();

    const flapper = OdometerUtils.createFlapper(untrack(() => props.target));

    $effect(() => () => flapper.stop());

    watchChange(
        () => props.target,
        (target) => flapper.flapTo(target, props.delayMs, props.durationMs),
    );

    const getPosition = readStore(flapper);

    const flapWindow = $derived(OdometerUtils.getFlapWindow(OdometerUtils.getDrawnFlapPosition(getPosition())));
</script>

<Spine
    faces={flapWindow.leaves}
    position={flapWindow.position}
    axis="column"
    hasBacks={true}
    faceSize={props.digitSize}
    faceRoleDescription=""
    computeFaceAngle={SpineUtils.leaves}
    computeFaceDefs={() => HIDDEN_FACE}
>
    {#snippet renderFace(leaf: OdometerFlapLeaf, _index: number, side: SpineSide)}
        <div class={[styles.odometerDigitFace, side === "front" ? styles.odometerFlapTop : styles.odometerFlapBottom]}>
            {@render props.renderCharacter(side === "front" ? leaf.front : leaf.back)}
        </div>
    {/snippet}
</Spine>
