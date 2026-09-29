<script lang="ts">
    import { setFormContext } from "../../Form/Form.context.js";
    import type { FormSectionContentProps } from "./FormSection.types.js";

    let props: FormSectionContentProps = $props();

    setFormContext({
        register: (entry) => props.context.register(entry),
        unregister: (entry) => props.context.unregister(entry),
        getIsValid: () => props.context.getIsValid(),
        getHasSubmitted: () => props.context.getHasSubmitted(),
    });
</script>

{@render props.children()}
