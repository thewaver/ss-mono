<script lang="ts">
    import { Color } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DropdownExample from "./Examples/Dropdown.svelte";
    import SurfaceExample from "./Examples/Surface.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/ColorAreaPage/Examples";

    const STARTING_HSV: Color.HSVA = { h: 210, s: 70, v: 90, a: 1 };
    const STARTING_PICKER_HSV: Color.HSVA = { h: 90, s: 50, v: 80, a: 1 };
    const STARTING_DISABLED_HSV: Color.HSVA = { h: 0, s: 60, v: 60, a: 1 };

    const popupId = $props.id();

    let bareHsv = $state.raw<Color.HSVA>(STARTING_HSV);
    let pickerHsv = $state.raw<Color.HSVA>(STARTING_PICKER_HSV);
    let disabledHsv = $state.raw<Color.HSVA>(STARTING_DISABLED_HSV);
    let isOpen = $state(false);
    let hue = $state(STARTING_PICKER_HSV.h);

    const examples: ExampleDefs[] = [
        {
            key: "bare",
            name: "The surface alone",
            readout: () =>
                `hsv: ${Math.round(bareHsv.h)}° ${Math.round(bareHsv.s)}% ${Math.round(bareHsv.v)}% — hex: ${Color.HSV.toHex(bareHsv)}`,
            component: bareExample,
            path: `${EXAMPLES_ROOT}/Surface.svelte`,
        },
        {
            key: "dropdown",
            name: "In a dropdown, replacing the OS dialog",
            readout: () => `${Color.HSVA.toHexa(pickerHsv)} — open: ${isOpen}`,
            component: dropdownExample,
            path: `${EXAMPLES_ROOT}/Dropdown.svelte`,
        },
        {
            key: "disabled",
            name: "Disabled",
            readout: () => "the drag is not attached at all, so nothing moves",
            component: disabledExample,
            path: `${EXAMPLES_ROOT}/Surface.svelte`,
        },
    ];
</script>

{#snippet bareExample()}
    <SurfaceExample bind:hsv={bareHsv} />
{/snippet}

{#snippet dropdownExample()}
    <DropdownExample bind:hsv={pickerHsv} bind:isOpen bind:hue {popupId} />
{/snippet}

{#snippet disabledExample()}
    <SurfaceExample bind:hsv={disabledHsv} isDisabled={true} />
{/snippet}

<PageExamples items={examples} />
