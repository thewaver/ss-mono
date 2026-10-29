import { RGB_ANIMATION_CHANNELS } from "../../../Exotics/Animations/RGBAnimation/RGBAnimation.const";
import type { RGBAnimationChannel } from "../../../Exotics/Animations/RGBAnimation/RGBAnimation.types";
import type {
    CellAnimationFn,
    CellStop,
} from "../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import type {
    RGBAnaglyphOpts,
    RGBEchoOpts,
    RGBFocusPullOpts,
    RGBHueSwapOpts,
    RGBOrbitOpts,
    RGBSwellOpts,
    RGBTiltOpts,
    RGBTwistOpts,
} from "./RGBAnimationKeyframes.types";

const SAMPLED_STOP_COUNT = 32;
const FULL_TURN_DEGREES = 360;
const TILT_PERSPECTIVE_PX = 600;
const ECHO_LAG_SHARE = 0.1;
const ECHO_TRAVEL_SHARE = 1 - ECHO_LAG_SHARE * (RGB_ANIMATION_CHANNELS.length - 1);
const FOCUS_WINDOW_SHARE = 0.5;
const FOCUS_STAGGER_SHARE = 0.25;
const SPREAD: Record<RGBAnimationChannel, number> = { red: 1, green: 0, blue: -1 };

const toSampledStops = (compute: (timeline: number) => Omit<CellStop, "at">): CellStop[] =>
    Array.from({ length: SAMPLED_STOP_COUNT + 1 }, (_, idx) => {
        const timeline = idx / SAMPLED_STOP_COUNT;

        return { at: timeline, ...compute(timeline) };
    });

const perChannel = (compute: (channel: RGBAnimationChannel, index: number) => CellStop[]) => {
    const stops = RGB_ANIMATION_CHANNELS.map((channel, index) => compute(channel, index));

    return CellAnimationKeyframeUtils.fromSlices(({ pos }) => stops[pos.col] ?? stops[0]);
};

const computeEchoPath = (timeline: number, distance: number) => {
    if (timeline <= 0 || timeline >= ECHO_TRAVEL_SHARE) return [0, 0];

    const turn = (timeline / ECHO_TRAVEL_SHARE) * 2 * Math.PI;

    return [distance * Math.sin(turn), distance * Math.sin(turn * 2) * 0.5];
};

const computeBump = (share: number) => (share <= 0 || share >= 1 ? 0 : (1 - Math.cos(share * 2 * Math.PI)) * 0.5);

export namespace RGBAnimationKeyframes {
    export const createAnaglyph = ({ separationPercent }: RGBAnaglyphOpts): CellAnimationFn =>
        perChannel((channel) =>
            toSampledStops((timeline) => ({
                translateX: -SPREAD[channel] * separationPercent * Math.sin(timeline * Math.PI),
            })),
        );

    export const computeEchoRootPath = (timeline: number, { distancePercent }: RGBEchoOpts) =>
        computeEchoPath(timeline, distancePercent);

    export const createEcho = ({ distancePercent }: RGBEchoOpts): CellAnimationFn =>
        perChannel((_, index) =>
            toSampledStops((timeline) => {
                const [rootX, rootY] = computeEchoPath(timeline, distancePercent);
                const [laggedX, laggedY] = computeEchoPath(timeline - index * ECHO_LAG_SHARE, distancePercent);

                return { translateX: laggedX - rootX, translateY: laggedY - rootY };
            }),
        );

    export const createFocusPull = ({ maxBlurPx }: RGBFocusPullOpts): CellAnimationFn =>
        perChannel((_, index) =>
            toSampledStops((timeline) => ({
                blur: maxBlurPx * computeBump((timeline - index * FOCUS_STAGGER_SHARE) / FOCUS_WINDOW_SHARE),
            })),
        );

    export const createHueSwap = ({ turns, anchor }: RGBHueSwapOpts): CellAnimationFn =>
        perChannel((channel) => {
            const direction =
                channel === anchor ? 0 : RGB_ANIMATION_CHANNELS.find((other) => other !== anchor) === channel ? 1 : -1;

            return [
                { "at": 0, "hue-rotate": 0 },
                { "at": 1, "hue-rotate": direction * turns * FULL_TURN_DEGREES },
            ];
        });

    export const createOrbit = ({ radiusPercent }: RGBOrbitOpts): CellAnimationFn =>
        perChannel((_, index) =>
            toSampledStops((timeline) => {
                const angle = (timeline + index / RGB_ANIMATION_CHANNELS.length) * 2 * Math.PI;
                const radius = radiusPercent * Math.sin(timeline * Math.PI);

                return { translateX: radius * Math.cos(angle), translateY: radius * Math.sin(angle) };
            }),
        );

    export const createSwell = ({ scalePercent }: RGBSwellOpts): CellAnimationFn =>
        perChannel((channel) =>
            toSampledStops((timeline) => {
                const scale = 100 + SPREAD[channel] * scalePercent * (1 - Math.cos(timeline * 2 * Math.PI)) * 0.5;

                return { scaleX: scale, scaleY: scale };
            }),
        );

    export const createTilt = ({ maxDegrees }: RGBTiltOpts): CellAnimationFn =>
        perChannel((channel) =>
            toSampledStops((timeline) => ({
                perspective: TILT_PERSPECTIVE_PX,
                rotateY: SPREAD[channel] * maxDegrees * Math.sin(timeline * 2 * Math.PI),
            })),
        );

    export const createTwist = ({ maxDegrees }: RGBTwistOpts): CellAnimationFn =>
        perChannel((channel) =>
            toSampledStops((timeline) => ({
                rotate: SPREAD[channel] * maxDegrees * Math.sin(timeline * Math.PI),
            })),
        );
}
