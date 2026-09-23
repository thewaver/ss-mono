import type { ParentProps } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import { Color, MathUtils, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SmootherUtils } from "../../../Abstracts/Smoother/Smoother.utils";
import { access } from "../../../Utils/propUtils";
import { SHADOW_CASTER_DEFAULTS } from "./ShadowCaster.const";
import type { ShadowCasterProps } from "./ShadowCaster.types";

import * as styles from "./ShadowCaster.css";

const FULLY_LIT = 1;
const NO_THROW = 0;
const FALLBACK_COLOR: Color.HSVA = { h: 0, s: 0, v: 0, a: 1 };

export const ShadowCaster = (props: ParentProps<ShadowCasterProps>) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef, getIsDisabled);

    const getLightRangePx = createMemo(() => access(props.lightRangePx) ?? SHADOW_CASTER_DEFAULTS.lightRangePx);

    const getIsInRange = createMemo(() => {
        const activeRangePx = access(props.activeRangePx);

        return activeRangePx === undefined || getReading().distance <= activeRangePx;
    });

    const getIsResting = createMemo(() => getIsDisabled() || !getIsPointerPresent() || !getIsInRange());

    const getReach = createMemo(() =>
        getIsResting() ? FULLY_LIT : MathUtils.clamp01(getReading().distance / getLightRangePx()),
    );

    const getThrow = createMemo(() => {
        if (getIsResting()) {
            return { x: NO_THROW, y: access(props.restingThrowPx) ?? SHADOW_CASTER_DEFAULTS.restingThrowPx };
        }

        const away = Point2dUtils.getNormal(getReading().offset);
        const length = MathUtils.lerp(
            access(props.minThrowPx) ?? SHADOW_CASTER_DEFAULTS.minThrowPx,
            access(props.maxThrowPx) ?? SHADOW_CASTER_DEFAULTS.maxThrowPx,
            getReach(),
        );

        return { x: -away.x * length, y: -away.y * length };
    });

    const getBlurPx = createMemo(() => {
        if (getIsResting()) return access(props.restingBlurPx) ?? SHADOW_CASTER_DEFAULTS.restingBlurPx;

        return MathUtils.lerp(
            access(props.minBlurPx) ?? SHADOW_CASTER_DEFAULTS.minBlurPx,
            access(props.maxBlurPx) ?? SHADOW_CASTER_DEFAULTS.maxBlurPx,
            getReach(),
        );
    });

    const getAlpha = createMemo(() => {
        if (getIsResting()) return access(props.restingOpacity) ?? SHADOW_CASTER_DEFAULTS.restingOpacity;

        return MathUtils.lerp(
            access(props.maxOpacity) ?? SHADOW_CASTER_DEFAULTS.maxOpacity,
            access(props.minOpacity) ?? SHADOW_CASTER_DEFAULTS.minOpacity,
            getReach(),
        );
    });

    const getShadow = SmootherUtils.create(
        () => [getThrow().x, getThrow().y, getBlurPx(), getAlpha()],
        () => access(props.smoothingMs) ?? SHADOW_CASTER_DEFAULTS.smoothingMs,
    );

    const getColor = createMemo(() => {
        const parsed = Color.parse(access(props.color) ?? SHADOW_CASTER_DEFAULTS.color) ?? FALLBACK_COLOR;
        const [, , , alpha] = getShadow();

        return Color.RGBA.toCss(Color.HSVA.toRgba({ ...parsed, a: alpha }));
    });

    const getFilter = createMemo(() => {
        const [x, y, blurPx] = getShadow();

        return `drop-shadow(${x}px ${y}px ${blurPx}px ${getColor()})`;
    });

    return (
        <div ref={setRef} class={styles.shadowCasterRoot} style={{ filter: getFilter() }}>
            {props.children}
        </div>
    );
};
