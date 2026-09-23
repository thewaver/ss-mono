import type { ParentProps } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import { Color, MathUtils, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../Abstracts/PointerTracker/PointerTracker.utils";
import { access } from "../../../Utils/propUtils";
import type { ShadowCasterProps } from "./ShadowCaster.types";

import * as styles from "./ShadowCaster.css";

const DEFAULT_SHADOW_CASTER_LIGHT_RANGE_PX = 420;
const DEFAULT_SHADOW_CASTER_MIN_THROW_PX = 0;
const DEFAULT_SHADOW_CASTER_MAX_THROW_PX = 46;
const DEFAULT_SHADOW_CASTER_RESTING_THROW_PX = 12;
const DEFAULT_SHADOW_CASTER_MIN_BLUR_PX = 6;
const DEFAULT_SHADOW_CASTER_MAX_BLUR_PX = 22;
const DEFAULT_SHADOW_CASTER_RESTING_BLUR_PX = 12;
const DEFAULT_SHADOW_CASTER_MAX_OPACITY = 0.85;
const DEFAULT_SHADOW_CASTER_MIN_OPACITY = 0;
const DEFAULT_SHADOW_CASTER_RESTING_OPACITY = 0.25;
const DEFAULT_SHADOW_CASTER_COLOR = "black";

const FULLY_LIT = 1;
const NO_THROW = 0;
const FALLBACK_COLOR: Color.HSVA = { h: 0, s: 0, v: 0, a: 1 };

export const ShadowCaster = (props: ParentProps<ShadowCasterProps>) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef, getIsDisabled);

    const getLightRangePx = createMemo(() => access(props.lightRangePx) ?? DEFAULT_SHADOW_CASTER_LIGHT_RANGE_PX);

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
            return { x: NO_THROW, y: access(props.restingThrowPx) ?? DEFAULT_SHADOW_CASTER_RESTING_THROW_PX };
        }

        const away = Point2dUtils.getNormal(getReading().offset);
        const length = MathUtils.lerp(
            access(props.minThrowPx) ?? DEFAULT_SHADOW_CASTER_MIN_THROW_PX,
            access(props.maxThrowPx) ?? DEFAULT_SHADOW_CASTER_MAX_THROW_PX,
            getReach(),
        );

        return { x: -away.x * length, y: -away.y * length };
    });

    const getBlurPx = createMemo(() => {
        if (getIsResting()) return access(props.restingBlurPx) ?? DEFAULT_SHADOW_CASTER_RESTING_BLUR_PX;

        return MathUtils.lerp(
            access(props.minBlurPx) ?? DEFAULT_SHADOW_CASTER_MIN_BLUR_PX,
            access(props.maxBlurPx) ?? DEFAULT_SHADOW_CASTER_MAX_BLUR_PX,
            getReach(),
        );
    });

    const getAlpha = createMemo(() => {
        if (getIsResting()) return access(props.restingOpacity) ?? DEFAULT_SHADOW_CASTER_RESTING_OPACITY;

        return MathUtils.lerp(
            access(props.maxOpacity) ?? DEFAULT_SHADOW_CASTER_MAX_OPACITY,
            access(props.minOpacity) ?? DEFAULT_SHADOW_CASTER_MIN_OPACITY,
            getReach(),
        );
    });

    const getColor = createMemo(() => {
        const parsed = Color.parse(access(props.color) ?? DEFAULT_SHADOW_CASTER_COLOR) ?? FALLBACK_COLOR;
        const alpha = getAlpha();

        return Color.RGBA.toCss(Color.HSVA.toRgba({ ...parsed, a: alpha }));
    });

    return (
        <div
            ref={setRef}
            class={styles.shadowCasterRoot}
            style={{
                filter: `drop-shadow(${getThrow().x}px ${getThrow().y}px ${getBlurPx()}px ${getColor()})`,
            }}
        >
            {props.children}
        </div>
    );
};
