<script lang="ts">
    import { SCRATCH_CARD_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { ScratchCardKnobs } from "@thewaver/ss-playground/App/Knobs/ScratchCards.const";
    import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import FrostedExample from "./Examples/Frosted.svelte";
    import TicketExample from "./Examples/Ticket.svelte";
    import WindowsExample from "./Examples/Windows.svelte";
    import type {
        ExampleKey,
        ExampleProgress,
        ScratchCardExampleProps,
        ScratchCardWindowsExampleProps,
    } from "./ScratchCardPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/Reveals/ScratchCardPage/Examples";

    const RATIO_DIGITS = 2;
    const NOTHING_SCRATCHED = 0;
    const WINDOW_COUNT = 3;
    const FIRST_WINDOW = 1;

    const applyScratch = (progress: ExampleProgress, ratio: number): ExampleProgress => ({
        ratio,
        hasCleared: ratio === NOTHING_SCRATCHED ? false : progress.hasCleared,
    });

    let precision = $state(SCRATCH_CARD_DEFAULTS.precision);
    let brushRadius = $state(SCRATCH_CARD_DEFAULTS.brushRadius);
    let softness = $state(SCRATCH_CARD_DEFAULTS.softness);
    let brushShape = $state<(typeof ScratchCardKnobs.BRUSH_SHAPES)[number]>(ScratchCardKnobs.STARTING_BRUSH_SHAPE);

    const computePoints = $derived.by(() => {
        if (brushShape === ScratchCardKnobs.CIRCLE) return undefined;

        const polygon = brushShape;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(polygon, size);
    });
    let threshold = $state(SCRATCH_CARD_DEFAULTS.clearThreshold);
    let progress = $state.raw<Record<ExampleKey, ExampleProgress>>({
        ticket: { ratio: NOTHING_SCRATCHED, hasCleared: false },
        frosted: { ratio: NOTHING_SCRATCHED, hasCleared: false },
    });
    let windowProgress = $state.raw<ExampleProgress[]>(
        Array.from({ length: WINDOW_COUNT }, () => ({ ratio: NOTHING_SCRATCHED, hasCleared: false })),
    );

    const exampleProps = (key: ExampleKey): ScratchCardExampleProps => ({
        brushRadius,
        precision,
        softness,
        computePoints,
        clearThreshold: threshold,
        onScratch: (ratio) => {
            progress = { ...progress, [key]: applyScratch(progress[key], ratio) };
        },
        onClear: () => (progress = { ...progress, [key]: { ...progress[key], hasCleared: true } }),
    });

    const windowsProps: ScratchCardWindowsExampleProps = $derived({
        brushRadius,
        precision,
        softness,
        computePoints,
        clearThreshold: threshold,
        onWindowScratch: (index, ratio) => {
            windowProgress = windowProgress.map((entry, at) => (at === index ? applyScratch(entry, ratio) : entry));
        },
        onWindowClear: (index) =>
            (windowProgress = windowProgress.map((entry, at) =>
                at === index ? { ...entry, hasCleared: true } : entry,
            )),
    });

    const describeWindows = () =>
        windowProgress
            .map(
                (entry, index) =>
                    `window ${index + FIRST_WINDOW}: ${
                        entry.hasCleared ? "cleared" : `${(entry.ratio * 100).toFixed(RATIO_DIGITS)}%`
                    }`,
            )
            .join(" · ");

    const describe = (key: ExampleKey, whileGoing: string) =>
        `${(progress[key].ratio * ScratchCardKnobs.MAX_THRESHOLD * 100).toFixed(RATIO_DIGITS)}% rubbed off — ${
            progress[key].hasCleared ? "the rest went by itself once the threshold was crossed" : whileGoing
        }`;

    const examples: ExampleDefs[] = [
        {
            key: "ticket",
            name: "Ticket",
            readout: () => describe("ticket", "keep going"),
            component: ticketExample,
            path: `${EXAMPLES_ROOT}/Ticket.svelte`,
        },
        {
            key: "frosted",
            name: "Frosted",
            readout: () => describe("frosted", "what is under it sharpens as the frost goes"),
            component: frostedExample,
            path: `${EXAMPLES_ROOT}/Frosted.svelte`,
        },
        {
            key: "windows",
            name: "Ticket with windows",
            readout: describeWindows,
            component: windowsExample,
            path: `${EXAMPLES_ROOT}/Windows.svelte`,
        },
    ];
</script>

{#snippet ticketExample()}
    <TicketExample {...exampleProps("ticket")} />
{/snippet}

{#snippet frostedExample()}
    <FrostedExample {...exampleProps("frosted")} />
{/snippet}

{#snippet windowsExample()}
    <WindowsExample {...windowsProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"precision"}
        label={"Precision"}
        hint={"How finely the card measures how much has been scratched off. Finer measurement costs more work each frame."}
    >
        <PageNumberField
            value={precision}
            min={ScratchCardKnobs.MIN_PRECISION}
            max={ScratchCardKnobs.MAX_PRECISION}
            step={ScratchCardKnobs.PRECISION_STEP}
            ariaLabel={"Precision"}
            onInput={(value) => (precision = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"brushRadius"}
        label={"Brush radius (px)"}
        hint={"How large a patch one stroke of the pointer clears."}
    >
        <PageNumberField
            value={brushRadius}
            min={ScratchCardKnobs.MIN_BRUSH_RADIUS}
            max={ScratchCardKnobs.MAX_BRUSH_RADIUS}
            step={ScratchCardKnobs.BRUSH_STEP}
            ariaLabel={"Brush radius in pixels"}
            onInput={(value) => (brushRadius = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"brushShape"}
        label={"Brush shape"}
        hint={"The outline of the patch a stroke clears."}
    >
        <PageSelectField
            value={brushShape}
            values={ScratchCardKnobs.BRUSH_SHAPES}
            ariaLabel={"Brush shape"}
            onChange={(value) => (brushShape = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"softness"}
        label={"Edge softness"}
        hint={"How gradually a cleared patch fades into what is still covered. 0 gives a hard edge."}
    >
        <PageNumberField
            value={softness}
            min={ScratchCardKnobs.MIN_SOFTNESS}
            max={ScratchCardKnobs.MAX_SOFTNESS}
            step={ScratchCardKnobs.SOFTNESS_STEP}
            ariaLabel={"Edge softness"}
            onInput={(value) => (softness = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"clearThreshold"}
        label={"Clear threshold"}
        hint={"How much of the card has to be scratched off before the rest is cleared for you."}
    >
        <PageNumberField
            value={threshold}
            min={ScratchCardKnobs.MIN_THRESHOLD}
            max={ScratchCardKnobs.MAX_THRESHOLD}
            step={ScratchCardKnobs.THRESHOLD_STEP}
            ariaLabel={"Clear threshold"}
            onInput={(value) => (threshold = value)}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
