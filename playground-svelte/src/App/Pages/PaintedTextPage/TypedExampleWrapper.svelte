<script lang="ts">
    import * as typewriterStyles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

    import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import TypedExample from "./Examples/Typed.svelte";
    import type { PaintedTextExampleWrapperProps } from "./PaintedTextPage.types";

    const ARRIVAL_EFFECTS = ["fade", "scale", "glow", "drop", "slide"] as const;

    type ArrivalEffect = (typeof ARRIVAL_EFFECTS)[number];

    const ARRIVAL_EFFECT_NAMES: Record<ArrivalEffect, string> = {
        fade: typewriterStyles.typewriterFade,
        scale: typewriterStyles.typewriterScale,
        glow: typewriterStyles.typewriterGlow,
        drop: typewriterStyles.typewriterDrop,
        slide: typewriterStyles.typewriterSlide,
    };

    let props: PaintedTextExampleWrapperProps = $props();

    let arrivalEffect = $state<ArrivalEffect>(PaintedTextKnobs.STARTING_ARRIVAL_EFFECT);
</script>

<TypedExample {...props} computeAnimationName={() => ARRIVAL_EFFECT_NAMES[arrivalEffect]} />

<PageExampleKnobs>
    <PageProp
        itemKey={"arrivalEffect"}
        label={"Arrival effect"}
        hint={"How each letter arrives. The keyframes are the Typewriter page's own, played by the painted letters."}
    >
        <PageSelectField
            value={arrivalEffect}
            values={ARRIVAL_EFFECTS}
            ariaLabel={"Arrival effect"}
            onChange={(effect) => {
                arrivalEffect = effect;
            }}
        />
    </PageProp>
</PageExampleKnobs>
