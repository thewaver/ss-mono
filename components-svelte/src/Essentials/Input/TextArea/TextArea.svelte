<script lang="ts">
    import TextField from "../../../Primitives/TextField/TextField.svelte";
    import type { TextAreaProps } from "./TextArea.types.js";

    let { value = $bindable(), ref = $bindable(), ...props }: TextAreaProps = $props();
</script>

<TextField {...props} bind:value bind:ref element="textarea" />
