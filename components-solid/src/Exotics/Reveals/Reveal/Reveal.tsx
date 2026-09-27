import { createMemo, createSignal } from "solid-js";
import type { JSX } from "solid-js";

import { REVEAL_DEFAULTS, RevealUtils, RevealStyles as styles } from "@thewaver/ss-components";
import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { PointerTrackerSolidUtils } from "../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { RevealProps } from "./RevealSolid.types";

export const Reveal = (props: RevealProps) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getIsDisabled = createMemo(() => access(props.isDisabled) === true);

    const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(getRootRef, getIsDisabled);

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef, getIsDisabled);

    const [getKeyboardPoint, setKeyboardPoint] = createSignal<Point2d>();

    const getRadius = createMemo(() => access(props.radius) ?? REVEAL_DEFAULTS.radius);

    const getIsPointerInside = createMemo(() => RevealUtils.getIsPointerInside(getIsPointerPresent(), getReading()));

    const getIsKeyboardDriven = createMemo(() => !getIsDisabled() && getKeyboardPoint() !== undefined);

    const getIsRevealing = createMemo(() =>
        RevealUtils.getIsRevealing(getIsDisabled(), getIsKeyboardDriven(), getIsPointerInside()),
    );

    const getHasHole = createMemo(() =>
        RevealUtils.getHasHole(getIsDisabled(), getIsKeyboardDriven(), getIsPointerPresent(), getRadius()),
    );

    const getPointerPoint = () => RevealUtils.toPointerPoint(getReading(), getSize());

    const getHoleCenter = createMemo(() =>
        RevealUtils.computeHoleCenter(
            getIsKeyboardDriven() ? getKeyboardPoint() : undefined,
            getPointerPoint(),
            getSize(),
        ),
    );

    const getHoleImage = createMemo(() =>
        RevealUtils.buildHoleImage(
            getRadius(),
            MathUtils.clamp01(access(props.softness) ?? REVEAL_DEFAULTS.softness),
            props.computePoints,
            access(props.joinRadii),
            access(props.lameExponents),
        ),
    );

    const getMaskStyle = createMemo<JSX.CSSProperties>(() =>
        RevealUtils.computeMaskStyle(getHasHole(), getHoleCenter(), getRadius(), getHoleImage()),
    );

    const handleFocus = () => {
        if (getIsDisabled() || !getRootRef()?.matches(":focus-visible")) return;

        setKeyboardPoint(RevealUtils.toCenter(getSize()));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const nudge = RevealUtils.getNudge(e);

        if (getIsDisabled() || !nudge) return;

        e.preventDefault();

        const from = getIsKeyboardDriven()
            ? getHoleCenter()
            : getIsPointerInside()
              ? getPointerPoint()
              : RevealUtils.toCenter(getSize());

        setKeyboardPoint(
            RevealUtils.computeNudgedPoint(from, nudge, access(props.stepSize) ?? REVEAL_DEFAULTS.stepSize, getSize()),
        );
    };

    return (
        <div
            ref={setRootRef}
            class={styles.revealRoot}
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

            <div class={styles.revealCover}>{props.renderCover(getIsRevealing, getMaskStyle)}</div>
        </div>
    );
};
