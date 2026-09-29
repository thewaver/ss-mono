<script lang="ts">
    import { REVEAL_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { RevealKnobs } from "@thewaver/ss-playground/App/Knobs/Reveals.const";
    import type { RevealShape } from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.types";
    import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import FrostedExample from "./Examples/Frosted.svelte";
    import PromptExample from "./Examples/Prompt.svelte";
    import TorchExample from "./Examples/Torch.svelte";
    import type { RevealExampleProps } from "./RevealExample.types";

    const EXAMPLES_ROOT = "/src/App/Pages/Reveals/RevealPage/Examples";
    const FIELD_WIDTH = 110;
    const SHAPE_FIELD_WIDTH = 170;

    let radius = $state(REVEAL_DEFAULTS.radius);
    let shape = $state<RevealShape>(RevealKnobs.STARTING_SHAPE);
    let joinRadius = $state(RevealKnobs.STARTING_JOIN_RADIUS);
    let lameExponent = $state(RevealKnobs.STARTING_LAME_EXPONENT);
    let softness = $state(REVEAL_DEFAULTS.softness);
    let stepSize = $state(REVEAL_DEFAULTS.stepSize);
    let isDisabled = $state(RevealKnobs.STARTING_IS_DISABLED);

    const isCircle = $derived(shape === RevealKnobs.CIRCLE);

    const computePoints = $derived.by(() => {
        if (shape === RevealKnobs.CIRCLE) return undefined;

        const polygon = shape;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(polygon, size);
    });

    const joinRadii = $derived([joinRadius]);
    const lameExponents = $derived([lameExponent]);

    const commonProps: RevealExampleProps = $derived({
        radius,
        softness,
        stepSize,
        joinRadii,
        lameExponents,
        isDisabled,
        computePoints,
    });

    const examples: ExampleDefs[] = [
        {
            key: "torch",
            name: "Torch",
            readout: () => "an opaque cover with a hole cut where the pointer is",
            component: torchExample,
            path: `${EXAMPLES_ROOT}/Torch.svelte`,
        },
        {
            key: "frosted",
            name: "Frosted",
            readout: () => "the cover blurs rather than hides, so the hole sharpens instead of uncovering",
            component: frostedExample,
            path: `${EXAMPLES_ROOT}/Frosted.svelte`,
        },
        {
            key: "prompt",
            name: "Cover that knows",
            readout: () => "the cover is told whether a reveal is happening, and says something different",
            component: promptExample,
            path: `${EXAMPLES_ROOT}/Prompt.svelte`,
        },
    ];
</script>

{#snippet torchExample()}
    <TorchExample {...commonProps} />
{/snippet}

{#snippet frostedExample()}
    <FrostedExample {...commonProps} />
{/snippet}

{#snippet promptExample()}
    <PromptExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"radius"}
        label={"Radius (px)"}
        hint={"How large the window that follows the pointer is."}
    >
        <PageNumberField
            value={radius}
            min={RevealKnobs.MIN_RADIUS}
            max={RevealKnobs.MAX_RADIUS}
            step={RevealKnobs.RADIUS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Radius"}
            onInput={(value) => (radius = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"computePoints"}
        label={"Shape"}
        hint={"The outline of the window that follows the pointer."}
    >
        <PageSelectField
            value={shape}
            values={RevealKnobs.SHAPES}
            width={SHAPE_FIELD_WIDTH}
            ariaLabel={"Shape"}
            onChange={(value) => (shape = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"joinRadii"}
        label={"Corner radius (px)"}
        hint={"How far the window's corners are rounded. A circular window has no corners, so it is off then."}
    >
        <PageNumberField
            value={joinRadius}
            min={RevealKnobs.MIN_JOIN_RADIUS}
            max={RevealKnobs.MAX_JOIN_RADIUS}
            step={RevealKnobs.JOIN_RADIUS_STEP}
            width={FIELD_WIDTH}
            isDisabled={isCircle}
            ariaLabel={"Corner radius"}
            onInput={(value) => (joinRadius = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"lameExponents"}
        label={"Lamé Exponent"}
        hint={"How square or how pinched the window's rounded corners are: 2 is a circular round, higher is squarer."}
    >
        <PageNumberField
            value={lameExponent}
            min={RevealKnobs.MIN_LAME_EXPONENT}
            max={RevealKnobs.MAX_LAME_EXPONENT}
            step={RevealKnobs.LAME_EXPONENT_STEP}
            width={FIELD_WIDTH}
            isDisabled={isCircle}
            ariaLabel={"Corner style"}
            onInput={(value) => (lameExponent = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"softness"}
        label={"Softness"}
        hint={"How gradually the window fades into what is still covered. 0 gives a hard edge."}
    >
        <PageNumberField
            value={softness}
            min={RevealKnobs.MIN_SOFTNESS}
            max={RevealKnobs.MAX_SOFTNESS}
            step={RevealKnobs.SOFTNESS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Clear fraction"}
            onInput={(value) => (softness = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"stepSize"}
        label={"Step size (px)"}
        hint={"How far one press of an arrow key moves the window. Tab to a reveal and it opens at the center; the arrow keys move it from there."}
    >
        <PageNumberField
            value={stepSize}
            min={RevealKnobs.MIN_STEP_SIZE}
            max={RevealKnobs.MAX_STEP_SIZE}
            step={RevealKnobs.STEP_SIZE_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Step size in pixels"}
            onInput={(value) => (stepSize = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Stops the window following the pointer or the keyboard, leaving whatever is underneath covered."}
    >
        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={(value) => (isDisabled = value)} />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
