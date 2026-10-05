<script lang="ts">
    import { untrack } from "svelte";

    import {
        type SlotTextFlapLeaf,
        SlotTextUtils,
        type SpineSide,
        SpineUtils,
        SlotTextStyles as styles,
    } from "@thewaver/ss-components";

    import Spine from "../../../Primitives/Spine/Spine.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import type { SlotTextFlapColumnProps } from "./SlotText.types.js";

    const HIDDEN_FACE = { ariaLabel: "", isHidden: true };

    let props: SlotTextFlapColumnProps = $props();

    const flapper = SlotTextUtils.createFlapper(untrack(() => props.target));

    $effect(() => () => flapper.stop());

    watchChange(
        () => props.target,
        (target) => flapper.flapTo(target, props.delayMs, props.durationMs),
    );

    const getPosition = readStore(flapper);

    const flapWindow = $derived(
        SlotTextUtils.getFlapWindow(SlotTextUtils.getDrawnFlapPosition(getPosition()), props.faces),
    );
</script>

<Spine
    faces={flapWindow.leaves}
    position={flapWindow.position}
    axis="column"
    hasBacks={true}
    faceSize={props.characterSize}
    faceRoleDescription=""
    computeFaceAngle={SpineUtils.leaves}
    computeFaceDefs={() => HIDDEN_FACE}
>
    {#snippet renderFace(leaf: SlotTextFlapLeaf, _index: number, side: SpineSide)}
        <div class={[styles.slotTextFace, side === "front" ? styles.slotTextFlapTop : styles.slotTextFlapBottom]}>
            {@render props.renderCharacter(side === "front" ? leaf.front : leaf.back)}
        </div>
    {/snippet}
</Spine>
