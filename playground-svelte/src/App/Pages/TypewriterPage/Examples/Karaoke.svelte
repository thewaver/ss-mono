<script lang="ts">
    import { Button, Range, Typewriter } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { TypewriterKaraokeExampleProps } from "../TypewriterPage.types";

    const LYRIC = "Twinkle, twinkle, little star";
    const PERCENT = 100;
    const SLIDER_STEP = 1;
    const SLIDER_LENGTH = 110;
    const CHARACTER_DELAY_MS = 120;
    const CHARACTER_DURATION_MS = 600;
    const RUN_START = 0;
    const RUN_END = 1;

    type Props = TypewriterKaraokeExampleProps;

    let props: Props = $props();

    let progress = $state(RUN_START);
    let isPlaying = $state(false);

    const togglePlaying = () => {
        if (!isPlaying && progress >= RUN_END) progress = RUN_START;

        isPlaying = !isPlaying;
    };
</script>

<div class={styles.karaokeStack}>
    <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
        <div class={styles.karaokeLine}>
            <Typewriter
                bind:progress
                bind:playback={isPlaying}
                computeAnimationName={() => styles.typewriterSweep}
                animationDelayMs={CHARACTER_DELAY_MS}
                animationDurationMs={CHARACTER_DURATION_MS}
                onAnimationEnd={() => {
                    isPlaying = false;
                }}
            >
                {LYRIC}
            </Typewriter>
        </div>
    </PageMeasureBox>

    <div class={styles.karaokeControls}>
        <Button id={"karaokePlay"} ariaLabel={isPlaying ? "Pause" : "Sing"} onClick={togglePlaying}>
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play} />
            {/snippet}
        </Button>

        <Range
            id={"karaokeScrubber"}
            sizing={"fill"}
            ariaLabel={"How far the line has been sung"}
            min={0}
            max={PERCENT}
            step={SLIDER_STEP}
            bind:value={() => Math.round(progress * PERCENT), (value: number) => (progress = value / PERCENT)}
        >
            {#snippet renderContent(renderProps)}
                <PageRangeContent {renderProps} length={SLIDER_LENGTH} />
            {/snippet}
        </Range>
    </div>
</div>
