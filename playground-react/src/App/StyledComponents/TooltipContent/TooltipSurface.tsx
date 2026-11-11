import { type PropsWithChildren, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import { ElementObserverUtils } from "@thewaver/ss-components";
import { SVGStyleDefsReactUtils, Shape } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import {
    fitFillGeomToArrow,
    toTooltipBodyStyle,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
import type { Size2d } from "@thewaver/ss-utils";

import { useNextLayerClass } from "../Layer/Layer.context";
import type { TooltipSurfaceProps } from "./TooltipContent.types";

const NO_SIZE: Size2d = { width: 0, height: 0 };

export const PageTooltipSurface = (props: PropsWithChildren<TooltipSurfaceProps>) => {
    const id = useId();
    const layerClass = useNextLayerClass();
    const probeRef = useRef<HTMLDivElement>(null);
    const [probeSize, setProbeSize] = useState(NO_SIZE);

    useLayoutEffect(() => {
        const probe = probeRef.current;

        if (!probe) return;

        return ElementObserverUtils.observeBorderBoxSize(probe, setProbeSize);
    }, []);

    const skin = useMemo(() => {
        const probe = probeRef.current;

        if (!probe || probeSize.width <= 0 || probeSize.height <= 0) return undefined;

        const style = getComputedStyle(probe);

        return {
            converted: SVGStyleDefsReactUtils.computeDefsFromStyle(style, probeSize, id),
            textColor: style.color,
        };
    }, [probeSize, id]);

    const converted = skin?.converted;

    return (
        <div className={[styles.tooltipFrame, layerClass].join(" ")}>
            <div ref={probeRef} className={styles.tooltipSkinProbe} aria-hidden="true" />

            <Shape
                computePoints={(size) => props.computeGeometry(size, toTooltipBodyStyle(converted))}
                fillGeom={fitFillGeomToArrow(converted?.fillGeom ?? [], props.hasArrow ?? false)}
                computeFillDefs={() => converted?.fillDefs ?? []}
                computeStrokeDefs={converted?.strokeDefs.length ? () => converted.strokeDefs : undefined}
                renderChildren={() => (
                    <div className={styles.tooltipText} style={{ color: skin?.textColor }}>
                        {props.children}
                    </div>
                )}
            />
        </div>
    );
};
