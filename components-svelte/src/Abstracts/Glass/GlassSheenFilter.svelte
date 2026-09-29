<svelte:options namespace="svg" />

<script lang="ts">
    import { SVGFilterDefsFactory } from "../../Generators/SVGDefs/SVGFilters/SVGFilterDefs.factory.js";
    import Markup from "../../Utils/Markup.svelte";
    import { PointerTrackerSvelteUtils } from "../PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import type { GlassSheenFilterProps } from "./GlassSvelte.types.js";

    let props: GlassSheenFilterProps = $props();

    const { getReading } = PointerTrackerSvelteUtils.create(() => props.element);

    const filter = $derived(
        new SVGFilterDefsFactory(props.filterId)
            .addSpecularLightingFilter({
                light: {
                    kind: "point",
                    x: getReading().boxRatio.x * props.size.width,
                    y: getReading().boxRatio.y * props.size.height,
                    z: props.defs.sheen.lightHeight,
                },
                surface: {
                    baseFrequency: props.defs.noise.frequency,
                    numOctaves: props.defs.noise.octaves,
                    seed: props.defs.noise.seed,
                },
                surfaceScale: props.defs.sheen.surfaceScale,
                specularConstant: props.defs.sheen.specularConstant,
                specularExponent: props.defs.sheen.specularExponent,
                lightingColor: "#FFFFFF",
            })
            .computeFilterPrimitives({ method: "chain", elementSize: props.size }),
    );
</script>

<Markup markup={filter} />
