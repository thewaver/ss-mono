<svelte:options namespace="svg" />

<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PagePatchCableProps } from "./PatchBoardContent.types";

    const MIN_BOW = 0.09;
    const BOW_RATIO = 0.55;

    const computeCablePath = (defs: PagePatchCableProps["defs"]) => {
        const isVertical = defs.orientation === "vertical";
        const span = isVertical ? defs.to.y - defs.from.y : defs.to.x - defs.from.x;
        const bow = Math.max(MIN_BOW, Math.abs(span) * BOW_RATIO);
        const lead = defs.fromKind === "out" ? bow : -bow;
        const first = isVertical ? `${defs.from.x} ${defs.from.y + lead}` : `${defs.from.x + lead} ${defs.from.y}`;
        const second = isVertical ? `${defs.to.x} ${defs.to.y - lead}` : `${defs.to.x - lead} ${defs.to.y}`;

        return `M ${defs.from.x} ${defs.from.y} C ${first}, ${second}, ${defs.to.x} ${defs.to.y}`;
    };

    let props: PagePatchCableProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<path
    class={[
        styles.patchCable,
        layerClass,
        props.defs.isPending && styles.isPending,
        !props.defs.isAllowed && styles.isRefused,
    ]}
    d={computeCablePath(props.defs)}
/>
