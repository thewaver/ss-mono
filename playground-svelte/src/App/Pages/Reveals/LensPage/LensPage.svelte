<script lang="ts">
    import { LENS_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { LensKnobs } from "@thewaver/ss-playground/App/Knobs/Lenses.const";
    import type { RevealShape } from "@thewaver/ss-playground/App/Pages/Reveals/RevealPage/RevealPage.types";
    import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PhotoExample from "./Examples/Photo.svelte";
    import PrintExample from "./Examples/Print.svelte";
    import type { LensExampleProps } from "./LensPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/Reveals/LensPage/Examples";
    const FIELD_WIDTH = 110;
    const SHAPE_FIELD_WIDTH = 170;

    let zoom = $state(LENS_DEFAULTS.zoom);
    let radius = $state(LENS_DEFAULTS.radius);
    let shape = $state<RevealShape>(LensKnobs.STARTING_SHAPE);
    let joinRadius = $state(LensKnobs.STARTING_JOIN_RADIUS);
    let lameExponent = $state(LensKnobs.STARTING_LAME_EXPONENT);
    let softness = $state(LENS_DEFAULTS.softness);
    let stepSize = $state(LENS_DEFAULTS.stepSize);
    let isDisabled = $state(LensKnobs.STARTING_IS_DISABLED);

    const isCircle = $derived(shape === LensKnobs.CIRCLE);

    const computePoints = $derived.by(() => {
        if (shape === LensKnobs.CIRCLE) return undefined;

        const polygon = shape;

        return (size: Size2d) => ShapeConst.getDefaultShapePoints(polygon, size);
    });

    const joinRadii = $derived([joinRadius]);
    const lameExponents = $derived([lameExponent]);

    const commonProps: LensExampleProps = $derived({
        zoom,
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
            key: "photo",
            name: "Photo",
            readout: () => "a picture drawn larger inside a window that follows the pointer",
            component: photoExample,
            path: `${EXAMPLES_ROOT}/Photo.svelte`,
        },
        {
            key: "print",
            name: "Small print",
            readout: () => "the word under the middle of the lens is the word under the pointer",
            component: printExample,
            path: `${EXAMPLES_ROOT}/Print.svelte`,
        },
    ];
</script>

{#snippet photoExample()}
    <PhotoExample {...commonProps} />
{/snippet}

{#snippet printExample()}
    <PrintExample {...commonProps} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"zoom"}
        label={"Zoom"}
        hint={"How many times larger the content is drawn inside the lens. 1 draws it at its own size."}
    >
        <PageNumberField
            value={zoom}
            min={LensKnobs.MIN_ZOOM}
            max={LensKnobs.MAX_ZOOM}
            step={LensKnobs.ZOOM_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Zoom"}
            onInput={(value) => (zoom = value)}
        />
    </PageProp>

    <PageProp itemKey={"radius"} label={"Radius (px)"} hint={"How large the lens that follows the pointer is."}>
        <PageNumberField
            value={radius}
            min={LensKnobs.MIN_RADIUS}
            max={LensKnobs.MAX_RADIUS}
            step={LensKnobs.RADIUS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Radius"}
            onInput={(value) => (radius = value)}
        />
    </PageProp>

    <PageProp itemKey={"computePoints"} label={"Shape"} hint={"The contour of the lens."}>
        <PageSelectField
            value={shape}
            values={LensKnobs.SHAPES}
            width={SHAPE_FIELD_WIDTH}
            ariaLabel={"Shape"}
            onChange={(value) => (shape = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"joinRadii"}
        label={"Corner radius (px)"}
        hint={"How far the lens's corners are rounded. A circular lens has no corners, so it is off then."}
    >
        <PageNumberField
            value={joinRadius}
            min={LensKnobs.MIN_JOIN_RADIUS}
            max={LensKnobs.MAX_JOIN_RADIUS}
            step={LensKnobs.JOIN_RADIUS_STEP}
            width={FIELD_WIDTH}
            isDisabled={isCircle}
            ariaLabel={"Corner radius"}
            onInput={(value) => (joinRadius = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"lameExponents"}
        label={"Lamé Exponent"}
        hint={"How square or how pinched the lens's rounded corners are: 2 is a circular round, higher is squarer."}
    >
        <PageNumberField
            value={lameExponent}
            min={LensKnobs.MIN_LAME_EXPONENT}
            max={LensKnobs.MAX_LAME_EXPONENT}
            step={LensKnobs.LAME_EXPONENT_STEP}
            width={FIELD_WIDTH}
            isDisabled={isCircle}
            ariaLabel={"Corner style"}
            onInput={(value) => (lameExponent = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"softness"}
        label={"Softness"}
        hint={"How gradually the lens's edge fades into the content around it. 1 gives a hard edge."}
    >
        <PageNumberField
            value={softness}
            min={LensKnobs.MIN_SOFTNESS}
            max={LensKnobs.MAX_SOFTNESS}
            step={LensKnobs.SOFTNESS_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Softness"}
            onInput={(value) => (softness = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"stepSize"}
        label={"Step size (px)"}
        hint={"How far one press of an arrow key moves the lens. Tab to a lens and it opens at the center; the arrow keys move it from there."}
    >
        <PageNumberField
            value={stepSize}
            min={LensKnobs.MIN_STEP_SIZE}
            max={LensKnobs.MAX_STEP_SIZE}
            step={LensKnobs.STEP_SIZE_STEP}
            width={FIELD_WIDTH}
            ariaLabel={"Step size in pixels"}
            onInput={(value) => (stepSize = value)}
        />
    </PageProp>

    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Stops the lens following the pointer or the keyboard, leaving the content as it is."}
    >
        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={(value) => (isDisabled = value)} />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
