import { type ParentProps, createMemo, createSignal, createUniqueId, onMount } from "solid-js";

import { SVGStyleDefsSolidUtils, Shape, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import {
    fitFillGeomToArrow,
    toTooltipBodyStyle,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
import type { Size2d } from "@thewaver/ss-utils";

import { useNextLayerClass } from "../Layer/Layer.context";
import type { TooltipSurfaceProps } from "./TooltipContent.types";

type Converted = ReturnType<typeof SVGStyleDefsSolidUtils.computeDefsFromStyle>;

export const PageTooltipSurface = (props: ParentProps<TooltipSurfaceProps>) => {
    const id = createUniqueId();
    const getLayerClass = useNextLayerClass();

    const [getProbe, setProbe] = createSignal<HTMLElement>();

    let probeElement: HTMLDivElement | undefined;

    onMount(() => setProbe(probeElement));

    let lastConversion: { probe: HTMLElement; size: Size2d; converted: Converted } | undefined;

    const convert = (size: Size2d) => {
        const probe = getProbe();

        if (!probe) return undefined;

        const isSame =
            lastConversion?.probe === probe &&
            lastConversion.size.width === size.width &&
            lastConversion.size.height === size.height;

        if (!isSame) {
            lastConversion = {
                probe,
                size,
                converted: SVGStyleDefsSolidUtils.computeDefsFromStyle(getComputedStyle(probe), size, id),
            };
        }

        return lastConversion?.converted;
    };

    const getTextColor = createMemo(() => {
        const probe = getProbe();

        return probe ? getComputedStyle(probe).color : undefined;
    });

    const getHasBorder = createMemo(() => {
        const probe = getProbe();

        if (!probe) return false;

        const style = getComputedStyle(probe);

        return [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth].some(
            (width) => parseFloat(width) > 0,
        );
    });

    return (
        <div class={[styles.tooltipFrame, getLayerClass()].join(" ")}>
            <div ref={probeElement} class={styles.tooltipSkinProbe} aria-hidden="true" />

            <Shape
                computePoints={(size) => props.computeGeometry(size, toTooltipBodyStyle(convert(size)))}
                fillGeom={() =>
                    fitFillGeomToArrow(lastConversion?.converted.fillGeom ?? [], access(props.hasArrow) ?? false)
                }
                computeFillDefs={(getSize) => convert(getSize())?.fillDefs ?? []}
                computeStrokeDefs={getHasBorder() ? (getSize) => convert(getSize())?.strokeDefs ?? [] : undefined}
                renderChildren={() => (
                    <div class={styles.tooltipText} style={{ color: getTextColor() }}>
                        {props.children}
                    </div>
                )}
            />
        </div>
    );
};
