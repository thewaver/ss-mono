<script lang="ts">
    import { untrack } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
    import { ShapeConst } from "@thewaver/ss-utils";

    import { ShapeKnobs } from "../../Knobs/Shapes.const";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import type { ShapeExampleGeometry, ShapeGeometryProps } from "./ShapePage.types";

    const CORNER_FIELD_WIDTH = 80;
    const MAX_CORNER_COLUMNS = 6;

    const spreadCornerValue = (previous: number[], index: number, value: number, hasIndividualCorners: boolean) => {
        if (!hasIndividualCorners) return previous.map(() => value);

        const next = [...previous];

        next[index] = value;

        return next;
    };

    let props: ShapeGeometryProps = $props();

    let hasIndividualCorners = $state(ShapeKnobs.STARTING_HAS_INDIVIDUAL_CORNERS);
    let shapeKind = $state<ShapeConst.DefaultShape>(
        untrack(() => props.startingShapeKind) ?? ShapeKnobs.STARTING_SHAPE_KIND,
    );
    let joinRadii = $state.raw<number[]>(ShapeKnobs.STARTING_JOIN_RADII);
    let lameExponents = $state.raw<number[]>(ShapeKnobs.STARTING_LAME_EXPONENTS);

    const shapePointCount = $derived(ShapeConst.getDefaultShapePoints(shapeKind, { width: 0, height: 0 }).length);

    const pointIterator = $derived(
        Array.from({ length: hasIndividualCorners ? shapePointCount : 1 }, (_, idx) => idx),
    );

    const columns = $derived(hasIndividualCorners ? Math.min(shapePointCount * 0.5, MAX_CORNER_COLUMNS) : 1);

    const templateColumns = $derived(`repeat(${columns}, 1fr)`);

    const geometryProps: ShapeExampleGeometry = $derived({
        shapeKind,
        joinRadii: joinRadii.slice(0, shapePointCount),
        lameExponents: lameExponents.slice(0, shapePointCount),
    });
</script>

{#snippet renderKnobs()}
    <PageProp
        itemKey={"shapeKind"}
        label={"Shape"}
        hint={"The contour the shape is cut to, which also decides how many corners the corner fields offer."}
    >
        <PageSelectField
            value={shapeKind}
            values={ShapeConst.DEFAULT_SHAPES}
            ariaLabel={"Shape"}
            onChange={(value) => {
                shapeKind = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"hasIndividualCorners"}
        label={"Individual corner settings"}
        hint={"Opens one field per corner instead of one field driving all of them together."}
    >
        <PageCheckField
            value={hasIndividualCorners}
            ariaLabel={"Individual corner settings"}
            onChange={(value) => {
                hasIndividualCorners = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"jointRadiiPx"}
        label={"Joint Radii (px)"}
        hint={"How far each corner is rounded. With individual corners off, the first field drives them all."}
    >
        <div class={styles.valueList} style:grid-template-columns={templateColumns}>
            {#each pointIterator as index (index)}
                <PageNumberField
                    value={joinRadii[index]}
                    min={ShapeKnobs.MIN_JOIN_RADIUS}
                    max={ShapeKnobs.MAX_JOIN_RADIUS}
                    step={ShapeKnobs.JOIN_RADIUS_STEP}
                    width={CORNER_FIELD_WIDTH}
                    id={`jointRadius${index + 1}`}
                    ariaLabel={`Joint radius ${index + 1}`}
                    onInput={(value) => {
                        joinRadii = spreadCornerValue(joinRadii, index, value, hasIndividualCorners);
                    }}
                />
            {/each}
        </div>
    </PageProp>

    <PageProp
        itemKey={"lameExponent"}
        label={"Lamé Exponent"}
        hint={"How square or how pinched each rounded corner is: 2 is a circular round, higher is squarer, lower is pinched inward."}
    >
        <div class={styles.valueList} style:grid-template-columns={templateColumns}>
            {#each pointIterator as index (index)}
                <PageNumberField
                    value={lameExponents[index]}
                    min={ShapeKnobs.MIN_LAME_EXPONENT}
                    max={ShapeKnobs.MAX_LAME_EXPONENT}
                    step={ShapeKnobs.LAME_EXPONENT_STEP}
                    width={CORNER_FIELD_WIDTH}
                    ariaLabel={`Lamé exponent ${index + 1}`}
                    onInput={(value) => {
                        lameExponents = spreadCornerValue(lameExponents, index, value, hasIndividualCorners);
                    }}
                />
            {/each}
        </div>
    </PageProp>
{/snippet}

{@render props.children(geometryProps, renderKnobs)}
