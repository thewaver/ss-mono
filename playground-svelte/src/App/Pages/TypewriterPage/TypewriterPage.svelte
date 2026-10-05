<script lang="ts">
    import { ScrambleTextWeights } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

    import { TypewriterKnobs } from "../../Knobs/Typewriters.const";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import ComplexExampleWrapper from "./ComplexExampleWrapper.svelte";
    import CustomInputExampleWrapper from "./CustomInputExampleWrapper.svelte";
    import KaraokeExample from "./Examples/Karaoke.svelte";
    import OutwardExample from "./Examples/Outward.svelte";
    import PhrasesExample from "./Examples/Phrases.svelte";
    import ScrollLitExample from "./Examples/ScrollLit.svelte";
    import type { TypewriterExampleWrapperProps, TypewriterTextEffect } from "./TypewriterPage.types";

    const TEXT_EFFECTS: TypewriterTextEffect[] = ["fade", "scale", "glow", "drop", "slide"];
    const TEXT_EFFECT_MAP: Record<TypewriterTextEffect, string> = {
        fade: styles.typewriterFade,
        scale: styles.typewriterScale,
        glow: styles.typewriterGlow,
        drop: styles.typewriterDrop,
        slide: styles.typewriterSlide,
    };

    const EXAMPLES_ROOT = "/src/App/Pages/TypewriterPage/Examples";

    let textContainerWidth = $state(TypewriterKnobs.STARTING_WIDTH);
    let textEffect = $state<TypewriterTextEffect>(TypewriterKnobs.STARTING_TEXT_EFFECT);
    let arrivalOrder = $state<(typeof TypewriterKnobs.ARRIVAL_ORDERS)[number]>(TypewriterKnobs.STARTING_ARRIVAL_ORDER);

    const computeAnimationName = () => TEXT_EFFECT_MAP[textEffect];

    const commonProps: TypewriterExampleWrapperProps = $derived({
        width: textContainerWidth,
        computeAnimationName,
        computeCharacterWeights: (count) =>
            arrivalOrder === "left_to_right" ? [] : ScrambleTextWeights.SAMPLE_WEIGHTS[arrivalOrder](count),
    });

    const examples: ExampleDefs[] = [
        {
            key: "complex",
            name: "Complex",
            component: complexExample,
            path: `${EXAMPLES_ROOT}/Complex.svelte`,
        },
        {
            key: "customInput",
            name: "Custom Input",
            component: customInputExample,
            path: `${EXAMPLES_ROOT}/CustomInput.svelte`,
        },
        {
            key: "phrases",
            name: "Phrases",
            readout: () =>
                "the example owns the loop: each run's end either holds the phrase and switches to erasing, or moves to the next phrase and types it, and the caret is placed from the same progress the characters are drawn from",
            component: phrasesExample,
            path: `${EXAMPLES_ROOT}/Phrases.svelte`,
        },
        {
            key: "karaoke",
            name: "Karaoke",
            readout: () =>
                "the line and the slider share one progress: singing writes it as it goes, and dragging the slider draws that moment — a stop can fall partway through a letter's own sweep",
            component: karaokeExample,
            path: `${EXAMPLES_ROOT}/Karaoke.svelte`,
        },
        {
            key: "scrollLit",
            name: "Lit by scrolling",
            readout: () =>
                "playback is off and the progress is how far the paragraph has traveled up its box; the letters not yet reached show their animation's first frame, which is the dimmed text",
            component: scrollLitExample,
            path: `${EXAMPLES_ROOT}/ScrollLit.svelte`,
        },
        {
            key: "outward",
            name: "Flying outward",
            readout: () =>
                "an animation per letter: the left half flies off to the left and the right half to the right, from the middle out, as the line crosses the middle of its box",
            component: outwardExample,
            path: `${EXAMPLES_ROOT}/Outward.svelte`,
        },
    ];
</script>

{#snippet complexExample()}
    <ComplexExampleWrapper {...commonProps} />
{/snippet}

{#snippet customInputExample()}
    <CustomInputExampleWrapper {...commonProps} />
{/snippet}

{#snippet phrasesExample()}
    <PhrasesExample {...commonProps} />
{/snippet}

{#snippet karaokeExample()}
    <KaraokeExample width={textContainerWidth} />
{/snippet}

{#snippet scrollLitExample()}
    <PageMeasureBox width={textContainerWidth}>
        <ScrollLitExample />
    </PageMeasureBox>
{/snippet}

{#snippet outwardExample()}
    <PageMeasureBox width={textContainerWidth}>
        <OutwardExample />
    </PageMeasureBox>
{/snippet}

<div class={styles.root}>
    <PagePropsPanel scope={"global"}>
        <PageProp
            itemKey={"textContainerWidth"}
            label={"Container width (px)"}
            hint={"How wide the box holding the text is, which decides where the lines wrap as the text is typed."}
        >
            <PageNumberField
                value={textContainerWidth}
                min={TypewriterKnobs.MIN_CONTAINER_WIDTH}
                max={TypewriterKnobs.MAX_CONTAINER_WIDTH}
                step={TypewriterKnobs.CONTAINER_WIDTH_STEP}
                ariaLabel={"Container width in pixels"}
                onInput={(width) => {
                    textContainerWidth = width;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"textEffect"}
            label={"Effect"}
            hint={"How each character arrives: plainly, or with one of the entrance effects."}
        >
            <PageSelectField
                value={textEffect}
                values={TEXT_EFFECTS}
                ariaLabel={"Effect"}
                onChange={(effect) => {
                    textEffect = effect;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"arrivalOrder"}
            label={"Arrival order"}
            hint={"The order the characters arrive in: left to right, from the middle out, scattered, and so on. Erasing runs it backwards. The caret is meant for left to right, and jumps about under the others."}
        >
            <PageSelectField
                value={arrivalOrder}
                values={TypewriterKnobs.ARRIVAL_ORDERS}
                ariaLabel={"Arrival order"}
                onChange={(order) => {
                    arrivalOrder = order;
                }}
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples items={examples} layout={"flow"} />
</div>
