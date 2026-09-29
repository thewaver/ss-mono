<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FormFieldContent/FormFieldContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { FormFieldMessageProps } from "./FormFieldContent.types";

    let props: FormFieldMessageProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.formFieldMessage, layerClass, props.state.hasError && styles.hasError]}>
    {@render props.children?.()}
</div>
