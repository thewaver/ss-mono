import { type CSSProperties, type FocusEvent, type KeyboardEvent, useMemo, useRef, useState } from "react";

import { LENS_DEFAULTS, LensStyles, LensUtils, RevealUtils } from "@thewaver/ss-components";
import { MathUtils, type Point2d, StringUtils } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { PointerTrackerReactUtils } from "../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import type { LensProps } from "./Lens.types";

const toReactStyle = (style: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

export const Lens = (props: LensProps) => {
    const rootRef = useRef<HTMLDivElement | null>(null);

    const isDisabled = props.isDisabled === true;

    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        rootRef,
        isDisabled,
        props.pointSource,
    );

    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef, isDisabled);

    const [keyboardPoint, setKeyboardPoint] = useState<Point2d>();

    const radius = props.radius ?? LENS_DEFAULTS.radius;

    const zoom = props.zoom ?? LENS_DEFAULTS.zoom;

    const isPointerInside = RevealUtils.getIsPointerInside(isPointerPresent, reading);

    const isKeyboardDriven = !isDisabled && keyboardPoint !== undefined;

    const hasLens = RevealUtils.getHasHole(isDisabled, isKeyboardDriven, isPointerPresent, radius);

    const pointerPoint = RevealUtils.toPointerPoint(reading, size);

    const lensCenter = RevealUtils.computeHoleCenter(isKeyboardDriven ? keyboardPoint : undefined, pointerPoint, size);

    const softness = MathUtils.clamp01(props.softness ?? LENS_DEFAULTS.softness);

    const lensImage = useMemo(
        () => RevealUtils.buildHoleImage(radius, softness, props.computePoints, props.joinRadii, props.lameExponents),
        [radius, softness, props.computePoints, props.joinRadii, props.lameExponents],
    );

    const layerStyle = toReactStyle(LensUtils.computeLayerStyle(hasLens, lensCenter, radius, lensImage));

    const copyStyle = toReactStyle(LensUtils.computeCopyStyle(lensCenter, zoom));

    const handleFocus = () => {
        if (isDisabled || !rootRef.current?.matches(":focus-visible")) return;

        setKeyboardPoint(RevealUtils.toCenter(size));
    };

    const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) setKeyboardPoint(undefined);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const nudge = RevealUtils.getNudge(e);

        if (isDisabled || !nudge) return;

        e.preventDefault();

        const from = isKeyboardDriven ? lensCenter : isPointerInside ? pointerPoint : RevealUtils.toCenter(size);

        setKeyboardPoint(RevealUtils.computeNudgedPoint(from, nudge, props.stepSize ?? LENS_DEFAULTS.stepSize, size));
    };

    return (
        <div
            ref={rootRef}
            className={LensStyles.lensRoot}
            role="group"
            tabIndex={isDisabled ? undefined : 0}
            aria-label={props.ariaLabel}
            aria-disabled={isDisabled || undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPointerMove={() => setKeyboardPoint(undefined)}
            onKeyDown={handleKeyDown}
        >
            {props.renderContent()}

            <div className={LensStyles.lensLayer} style={layerStyle} aria-hidden="true" inert>
                <div className={LensStyles.lensCopy} style={copyStyle}>
                    {props.renderContent()}
                </div>
            </div>
        </div>
    );
};
