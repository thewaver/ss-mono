<script lang="ts">
    import type { ImageSwitcherProps } from "@thewaver/ss-components-svelte";
    import { IMAGE_SWITCHER_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { ImageSwitcherKnobs } from "@thewaver/ss-playground/App/Knobs/ImageSwitchers.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.css";
    import type { SourceType } from "@thewaver/ss-playground/App/Pages/ImageSwitcherPage/ImageSwitcherPage.types";
    import knight_date from "@thewaver/ss-playground/App/knight_date.webp";
    import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import DefaultExampleWrapper from "./DefaultExampleWrapper.svelte";

    const MISSING_SRC = "missing_image.webp";

    const SOURCE_URLS: Record<SourceType, string | undefined> = {
        profile: knight_profile,
        date: knight_date,
        missing_file: MISSING_SRC,
        none: undefined,
    };

    const SOURCE_ALTS: Record<SourceType, string | undefined> = {
        profile: "A knight in profile",
        date: "A knight on a date",
        missing_file: "A picture that will not load",
        none: undefined,
    };

    const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/ImageSwitcherPage/Examples/Default.svelte";

    let sourceType = $state<SourceType>(ImageSwitcherKnobs.STARTING_SOURCE_TYPE);
    let transitionDurationMs = $state(IMAGE_SWITCHER_DEFAULTS.transitionDurationMs);
    let loadCount = $state(0);
    let loadedName = $state("none");

    const onLoad = (e: Event) => {
        const loaded = (e.target as HTMLImageElement).src;

        loadCount += 1;
        loadedName = loaded.slice(loaded.lastIndexOf("/") + 1);
    };

    const commonProps: ImageSwitcherProps = $derived({
        src: SOURCE_URLS[sourceType],
        alt: SOURCE_ALTS[sourceType],
        transitionDurationMs,
        onLoad,
    });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: "Default",
            readout: () => `loads: ${loadCount} | last loaded: ${loadedName}`,
            component: defaultExample,
            path: DEFAULT_EXAMPLE_PATH,
        },
    ];
</script>

{#snippet defaultExample()}
    <DefaultExampleWrapper {...commonProps} />
{/snippet}

<div class={styles.root}>
    <PagePropsPanel scope={"global"}>
        <PageProp
            itemKey={"sourceType"}
            label={"Source"}
            hint={"Where the pictures come from, which is what decides how long each one takes to load."}
        >
            <PageSelectField
                value={sourceType}
                values={ImageSwitcherKnobs.SOURCE_TYPES}
                ariaLabel={"Source"}
                onChange={(value) => {
                    sourceType = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            label={"Transition duration (ms)"}
            hint={"How long the crossfade from one picture to the next takes."}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={ImageSwitcherKnobs.MIN_DURATION_MS}
                max={ImageSwitcherKnobs.MAX_DURATION_MS}
                step={ImageSwitcherKnobs.DURATION_STEP_MS}
                ariaLabel={"Transition duration"}
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples items={examples} layout={"flow"} />
</div>
