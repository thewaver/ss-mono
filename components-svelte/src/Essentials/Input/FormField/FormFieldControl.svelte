<script lang="ts">
    import { setFormFieldContext } from "./FormField.context.js";
    import type { FormFieldControlProps } from "./FormField.types.js";

    let props: FormFieldControlProps = $props();

    setFormFieldContext({
        getDescriptionId: () => props.context.getDescriptionId(),
        registerControl: (element) => props.context.registerControl(element),
        unregisterControl: (element) => props.context.unregisterControl(element),
    });
</script>

{@render props.children()}
