<script lang="ts">
    import type { ToastsFarDownProps } from "../ToastsPageSvelte.types";
    import FarDownProfileForm from "./FarDownProfileForm.svelte";

    let props: ToastsFarDownProps = $props();
</script>

<FarDownProfileForm onAnswer={props.onAnswer} />
