import { type ParentProps, createMemo, createSignal, createUniqueId, onMount } from "solid-js";

import { SVGStyleDefsSolidUtils, Shape, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import {
    computeTooltipBackdropBox,
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
    const [getContourPath, setContourPath] = createSignal("");
    const [getBackdropFilter, setBackdropFilter] = createSignal<string>();

    const getBackdropBox = createMemo(() => computeTooltipBackdropBox(getContourPath()));

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

            {getBackdropFilter() && getBackdropBox() && (
                <div
                    class={[styles.tooltipBackdrop, styles.tooltipFadePart].join(" ")}
                    aria-hidden="true"
                    style={{
                        "backdrop-filter": getBackdropFilter(),
                        "clip-path": `path("${getBackdropBox()?.path}")`,
                        "left": `${getBackdropBox()?.left}px`,
                        "top": `${getBackdropBox()?.top}px`,
                        "width": `${getBackdropBox()?.width}px`,
                        "height": `${getBackdropBox()?.height}px`,
                    }}
                />
            )}

            <div class={styles.tooltipFadePart}>
                <Shape
                    computePoints={(size) => props.computeGeometry(size, toTooltipBodyStyle(convert(size)))}
                    fillGeom={() =>
                        fitFillGeomToArrow(lastConversion?.converted.fillGeom ?? [], access(props.hasArrow) ?? false)
                    }
                    onContourChange={(contour) => {
                        setContourPath(contour.path);
                        setBackdropFilter(lastConversion?.converted.backdropFilter);
                    }}
                    computeFillDefs={(getSize) => convert(getSize())?.fillDefs ?? []}
                    computeStrokeDefs={getHasBorder() ? (getSize) => convert(getSize())?.strokeDefs ?? [] : undefined}
                    renderChildren={() => (
                        <div class={styles.tooltipText} style={{ color: getTextColor() }}>
                            {props.children}
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
