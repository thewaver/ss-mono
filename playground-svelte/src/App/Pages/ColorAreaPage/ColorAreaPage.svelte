<script lang="ts">
    import { Color } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import DropdownExample from "./Examples/Dropdown.svelte";
    import SurfaceExample from "./Examples/Surface.svelte";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    STARTING_DISABLED_HSV,
    STARTING_HSV,
    STARTING_PICKER_HSV,
} from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";

    const popupId = $props.id();

    let bareHsv = $state.raw<Color.HSVA>(STARTING_HSV);
    let pickerHsv = $state.raw<Color.HSVA>(STARTING_PICKER_HSV);
    let disabledHsv = $state.raw<Color.HSVA>(STARTING_DISABLED_HSV);
    let isOpen = $state(false);
    let hue = $state(STARTING_PICKER_HSV.h);

    const examples: ExampleDefs[] = [
        {
            key: "bare",
            name: EXAMPLE_NAMES.bare,
            readout: () =>
                `hsv: ${Math.round(bareHsv.h)}° ${Math.round(bareHsv.s)}% ${Math.round(bareHsv.v)}% — hex: ${Color.HSV.toHex(bareHsv)}`,
            component: bareExample,
            path: `${EXAMPLES_ROOT}/Surface.svelte`,
        },
        {
            key: "dropdown",
            name: EXAMPLE_NAMES.dropdown,
            readout: () => `${Color.HSVA.toHexa(pickerHsv)} — open: ${isOpen}`,
            component: dropdownExample,
            path: `${EXAMPLES_ROOT}/Dropdown.svelte`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
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
