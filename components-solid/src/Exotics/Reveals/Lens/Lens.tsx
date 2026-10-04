import { createMemo, createSignal } from "solid-js";
import type { JSX } from "solid-js";

import { LENS_DEFAULTS, LensUtils, RevealUtils, LensStyles as styles } from "@thewaver/ss-components";
import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { PointerTrackerSolidUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { LensProps } from "./LensSolid.types";

export const Lens = (props: LensProps) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getIsDisabled = createMemo(() => access(props.isDisabled) === true);

    const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(getRootRef, getIsDisabled, () =>
        access(props.pointSource),
    );

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef, getIsDisabled);

    const [getKeyboardPoint, setKeyboardPoint] = createSignal<Point2d>();

    const getRadius = createMemo(() => access(props.radius) ?? LENS_DEFAULTS.radius);

    const getZoom = createMemo(() => access(props.zoom) ?? LENS_DEFAULTS.zoom);

    const getIsPointerInside = createMemo(() => RevealUtils.getIsPointerInside(getIsPointerPresent(), getReading()));

    const getIsKeyboardDriven = createMemo(() => !getIsDisabled() && getKeyboardPoint() !== undefined);

    const getHasLens = createMemo(() =>
        RevealUtils.getHasHole(getIsDisabled(), getIsKeyboardDriven(), getIsPointerPresent(), getRadius()),
    );

    const getPointerPoint = () => RevealUtils.toPointerPoint(getReading(), getSize());

    const getLensCenter = createMemo(() =>
        RevealUtils.computeHoleCenter(
            getIsKeyboardDriven() ? getKeyboardPoint() : undefined,
            getPointerPoint(),
            getSize(),
        ),
    );

    const getLensImage = createMemo(() =>
        RevealUtils.buildHoleImage(
            getRadius(),
            MathUtils.clamp01(access(props.softness) ?? LENS_DEFAULTS.softness),
            props.computePoints,
            access(props.joinRadii),
            access(props.lameExponents),
        ),
    );

    const getLayerStyle = createMemo<JSX.CSSProperties>(() =>
        LensUtils.computeLayerStyle(getHasLens(), getLensCenter(), getRadius(), getLensImage()),
    );

    const getCopyStyle = createMemo<JSX.CSSProperties>(() => LensUtils.computeCopyStyle(getLensCenter(), getZoom()));

    const handleFocus = () => {
        if (getIsDisabled() || !getRootRef()?.matches(":focus-visible")) return;

        setKeyboardPoint(RevealUtils.toCenter(getSize()));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const nudge = RevealUtils.getNudge(e);

        if (getIsDisabled() || !nudge) return;

        e.preventDefault();

        const from = getIsKeyboardDriven()
            ? getLensCenter()
            : getIsPointerInside()
              ? getPointerPoint()
              : RevealUtils.toCenter(getSize());

        setKeyboardPoint(
            RevealUtils.computeNudgedPoint(from, nudge, access(props.stepSize) ?? LENS_DEFAULTS.stepSize, getSize()),
        );
    };

    return (
        <div
            ref={setRootRef}
            class={styles.lensRoot}
            role="group"
            tabindex={getIsDisabled() ? undefined : 0}
            aria-label={access(props.ariaLabel)}
            aria-disabled={getIsDisabled() || undefined}
            onFocus={handleFocus}
            onBlur={() => setKeyboardPoint(undefined)}
            onPointerMove={() => setKeyboardPoint(undefined)}
            onKeyDown={handleKeyDown}
        >
            {props.renderContent()}

            <div class={styles.lensLayer} style={getLayerStyle()} aria-hidden="true" inert>
                <div class={styles.lensCopy} style={getCopyStyle()}>
                    {props.renderContent()}
                </div>
            </div>
        </div>
    );
};
