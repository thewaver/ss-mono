<script lang="ts">
    import { getFormFieldContext, setFormFieldContext } from "../FormField/FormField.context.js";
    import { getLabelContext, setLabelContext } from "../Label/Label.context.js";
    import type { DateRangePickerFieldsScopeProps } from "./DateRangePicker.types.js";

    let props: DateRangePickerFieldsScopeProps = $props();

    const outerFieldContext = getFormFieldContext();
    const outerLabelContext = getLabelContext();

    setFormFieldContext({ ...outerFieldContext, getCaptionId: () => undefined });
    setLabelContext({ ...outerLabelContext, getIsLabeled: () => false });
</script>

{@render props.children()}
