<script lang="ts">
    import type { Snippet } from "svelte";

    import { type PlacementSector, PlacementUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { PageWheelWedgeProps } from "./WheelContentSvelte.types";
    import {
        FULL_TURN,
        HALF,
        HALF_TURN,
        LABEL_TYPE_RATIO,
        NO_TILT,
        QUARTER_TURN,
        UPSIDE_DOWN_FROM,
        UPSIDE_DOWN_TO,
    } from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.const";

    const toLabelTilt = (wedgeAngle: number, sector: PlacementSector | undefined) => {
        if (!sector) return NO_TILT;

        const tilt = (sector.fromAngle + sector.toAngle) * HALF + QUARTER_TURN;
        const painted = (((wedgeAngle + tilt) % FULL_TURN) + FULL_TURN) % FULL_TURN;
        const isUpsideDown = painted > UPSIDE_DOWN_FROM && painted < UPSIDE_DOWN_TO;

        return tilt + (isUpsideDown ? HALF_TURN : NO_TILT);
    };

    let props: PageWheelWedgeProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());

    const gradientId = $props.id();

    const rect = $derived(props.state.placement);
</script>

{#if rect}
    <div class={[styles.wheelWedge, layerClass, props.state.isSelected && styles.isSelected]}>
        <svg class={styles.wheelWedgeSVG} viewBox={"0 0 1 1"}>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                    <stop class={styles.wheelWedgeGradientFrom} offset="0%" />
                    <stop class={styles.wheelWedgeGradientTo} offset="100%" />
                </linearGradient>
            </defs>

            <path
                class={styles.wheelWedgeShape}
                style:fill={props.state.isSelected ? `url(#${gradientId})` : undefined}
                d={PlacementUtils.getSectorPath(rect.sector!)}
            />
        </svg>

        <div
            class={styles.wheelWedgeLabel}
            style:left={PlacementUtils.toContainerWidth(rect.leftShare)}
            style:top={PlacementUtils.toContainerWidth(rect.topShare)}
            style:width={PlacementUtils.toContainerWidth(rect.widthShare)}
            style:height={PlacementUtils.toContainerWidth(rect.heightShare)}
            style:font-size={PlacementUtils.toContainerWidth(rect.widthShare * LABEL_TYPE_RATIO)}
            style:transform={`translate(-50%, -50%) rotate(${toLabelTilt(props.state.angle, rect.sector)}deg)`}
        >
            {@render props.children?.()}
        </div>
    </div>
{/if}
