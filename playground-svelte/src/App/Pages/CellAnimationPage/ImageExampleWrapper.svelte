<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
    import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageFileField from "../../PageComponents/Field/PageFileField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PagePlaybackScrubber from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import type { CellAnimationExampleProps } from "./CellAnimationPage.types";
    import DefaultExample from "./Examples/Default.svelte";

    const IMAGE_CONTAINER_SIZE = 480;

    type Props = CellAnimationExampleProps & { progress: number };

    let { playback = $bindable(), progress = $bindable(), ...props }: Props = $props();

    let src = $state(knight_profile);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
        <DefaultExample {...props} bind:playback bind:progress {src} />
    </PageMeasureBox>

    <PagePlaybackScrubber id={"cellAnimation"} ariaLabel={"Position in the pass"} bind:playback bind:progress />
</div>

<PageExampleKnobs>
    <PageProp
        itemKey={"image"}
        label={"Image"}
        hint={"Swaps in a picture of your own, so the cells can be watched against something other than the sample."}
    >
        <PageFileField
            accept={"image/*"}
            ariaLabel={"Image"}
            onPick={(file) => {
                src = URL.createObjectURL(file);
            }}
        />
    </PageProp>
</PageExampleKnobs>
