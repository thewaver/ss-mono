<script lang="ts">
    import type { ToastsFarDownProps } from "../ToastsPageSvelte.types";
    import FarDownSaveButton from "./FarDownSaveButton.svelte";

    let props: ToastsFarDownProps = $props();
</script>

<FarDownSaveButton id={"farDownInside"} caption={"Save inside"} onAnswer={props.onAnswer} />
