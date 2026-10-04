<script lang="ts">
    import { DIE_DEFAULTS, DieShapes, MediaQueryMonitorSvelteUtils, RollerUtils } from "@thewaver/ss-components-svelte";
    import { DieKnobs } from "@thewaver/ss-playground/App/Knobs/Dice.const";
    import {
        ICON_CLOUD_EMPTY_LABEL,
        ICON_CLOUD_ICONS,
        ICON_CLOUD_TURN_MS,
    } from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import IconCloudExample from "./Examples/IconCloud.svelte";
    import TabletopExample from "./Examples/Tabletop.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/DiePage/Examples";

    const DIE_SIZE = 160;
    const CLOUD_SIZE = 240;
    const NO_MOTION_DURATION_MS = 0;
    const FIRST_NUMBER = 1;

    let shapeKey = $state<DieShapes.SampleKey>(DieKnobs.STARTING_SHAPE_KEY);
    let rollDurationMs = $state(DIE_DEFAULTS.rollDurationMs);
    let tumbleCount = $state(DIE_DEFAULTS.tumbleCount);

    let dieFace = $state(0);
    let cloudFace = $state(0);
    let cloudAutoSpin = $state(true);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const prefersReducedMotion = $derived(getPrefersReducedMotion());

    const shownRollDurationMs = $derived(prefersReducedMotion ? NO_MOTION_DURATION_MS : rollDurationMs);
    const shownSettleDurationMs = $derived(
        prefersReducedMotion ? NO_MOTION_DURATION_MS : DIE_DEFAULTS.settleDurationMs,
    );
    const shownMomentumMs = $derived(prefersReducedMotion ? NO_MOTION_DURATION_MS : DIE_DEFAULTS.momentumMs);
    const shape = $derived(DieShapes.SAMPLE_SHAPES[shapeKey]);
    const cloudIdleDelayMs = $derived(prefersReducedMotion ? undefined : ICON_CLOUD_TURN_MS / shape.faces.length);

    const examples: ExampleDefs[] = [
        {
            key: "tabletop",
            name: "Tabletop die",
            readout: () =>
                `showing ${dieFace + FIRST_NUMBER} of ${DieShapes.SAMPLE_SHAPES[shapeKey].faces.length} — the page picks the number, and the die tumbles and lands on it`,
            component: tabletopExample,
            path: `${EXAMPLES_ROOT}/Tabletop.svelte`,
        },
        {
            key: "iconCloud",
            name: "Icon cloud",
            readout: () =>
                `${cloudAutoSpin ? "turning by itself" : "paused"}, facing ${ICON_CLOUD_ICONS[RollerUtils.clampFace(cloudFace, shape.faces.length)]?.label ?? ICON_CLOUD_EMPTY_LABEL} — drag it, or focus it and use the arrow keys, and it settles on the nearest icon`,
            component: iconCloudExample,
            path: `${EXAMPLES_ROOT}/IconCloud.svelte`,
        },
    ];
</script>

{#snippet tabletopExample()}
    <TabletopExample
        {shape}
        size={DIE_SIZE}
        rollDurationMs={shownRollDurationMs}
        settleDurationMs={shownSettleDurationMs}
        {tumbleCount}
        bind:face={dieFace}
    />
{/snippet}

{#snippet iconCloudExample()}
    <IconCloudExample
        {shape}
        size={CLOUD_SIZE}
        idleDelayMs={cloudIdleDelayMs}
        settleDurationMs={shownSettleDurationMs}
        momentumMs={shownMomentumMs}
        bind:face={cloudFace}
        bind:autoSpin={cloudAutoSpin}
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"shape"} label={"Die"} hint={"Which solid both examples are, from four faces to a hundred."}>
        <PageSelectField
            value={shapeKey}
            values={DieShapes.SAMPLE_KEYS}
            ariaLabel={"Die"}
            onChange={(key) => {
                shapeKey = key;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"rollDurationMs"}
        label={"Roll duration (ms)"}
        hint={"How long a roll takes to land. It is off while the visitor has asked for reduced motion."}
    >
        <PageNumberField
            value={rollDurationMs}
            min={DieKnobs.MIN_ROLL_DURATION_MS}
            max={DieKnobs.MAX_ROLL_DURATION_MS}
            step={DieKnobs.ROLL_DURATION_STEP_MS}
            isDisabled={prefersReducedMotion}
            ariaLabel={"Roll duration in milliseconds"}
            onInput={(value) => {
                rollDurationMs = value;
            }}
        />
    </PageProp>

    <PageProp itemKey={"tumbleCount"} label={"Tumbles"} hint={"How many whole turns a roll makes on its way."}>
        <PageNumberField
            value={tumbleCount}
            min={DieKnobs.MIN_TUMBLE_COUNT}
            max={DieKnobs.MAX_TUMBLE_COUNT}
            step={DieKnobs.TUMBLE_COUNT_STEP}
            ariaLabel={"Tumbles"}
            onInput={(value) => {
                tumbleCount = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
