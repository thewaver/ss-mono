<script lang="ts" module>
    import { RGBAnimationKeyframes, type SliceAnimationFn } from "@thewaver/ss-components-svelte";
    import { RGBAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/RGBAnimations.const";
    import type { CSSAnimationValues } from "@thewaver/ss-utils";

    const STRESS_SAMPLES: (() => {
        animation: SliceAnimationFn;
        computeRootAnimation?: (timeline: number) => CSSAnimationValues;
    })[] = [
        () => ({
            animation: RGBAnimationKeyframes.createSwell({ scalePercent: RGBAnimationKnobs.STARTING_SCALE_PERCENT }),
        }),
        () => ({
            animation: RGBAnimationKeyframes.createOrbit({
                radiusPercent: RGBAnimationKnobs.STARTING_ORBIT_RADIUS_PERCENT,
            }),
        }),
        () => ({
            animation: RGBAnimationKeyframes.createFocusPull({ maxBlurPx: RGBAnimationKnobs.STARTING_FOCUS_BLUR_PX }),
        }),
        () => ({
            animation: RGBAnimationKeyframes.createTwist({ maxDegrees: RGBAnimationKnobs.STARTING_TWIST_DEGREES }),
        }),
        () => ({
            animation: RGBAnimationKeyframes.createHueSwap({
                turns: RGBAnimationKnobs.STARTING_HUE_TURNS,
                anchor: "red",
            }),
        }),
        () => ({
            animation: RGBAnimationKeyframes.createTilt({ maxDegrees: RGBAnimationKnobs.STARTING_TILT_DEGREES }),
        }),
        () => ({
            animation: RGBAnimationKeyframes.createAnaglyph({
                separationPercent: RGBAnimationKnobs.STARTING_ANAGLYPH_SEPARATION_PERCENT,
            }),
        }),
        () => {
            const opts = { distancePercent: RGBAnimationKnobs.STARTING_ECHO_DISTANCE_PERCENT };

            return {
                animation: RGBAnimationKeyframes.createEcho(opts),
                computeRootAnimation: (timeline) => ({
                    translate: RGBAnimationKeyframes.computeEchoRootPath(timeline, opts),
                }),
            };
        },
    ];
</script>

<script lang="ts">
    import { RGBAnimation, type SliceAnimationRenderer } from "@thewaver/ss-components-svelte";
    import { STRESS_ITEM_WIDTH } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.const";
    import type { BaseRGBAnimationExampleProps } from "@thewaver/ss-playground/App/Pages/RGBAnimationPage/RGBAnimationPage.types";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";

    type Props = BaseRGBAnimationExampleProps & { modalPlayback: boolean; renderer: SliceAnimationRenderer };

    let { modalPlayback = $bindable(), ...props }: Props = $props();

    const sample = STRESS_SAMPLES[Math.floor(Math.random() * STRESS_SAMPLES.length)]();
</script>

<PageMeasureBox width={STRESS_ITEM_WIDTH}>
    <RGBAnimation
        bind:playback={modalPlayback}
        src={props.src}
        colorMixing={props.colorMixing}
        animationDurationMs={props.animationDurationMs}
        animationIterationDelayMs={props.animationIterationDelayMs}
        renderer={props.renderer}
        computeRootAnimation={sample.computeRootAnimation}
        computeSliceAnimation={sample.animation}
    />
</PageMeasureBox>
