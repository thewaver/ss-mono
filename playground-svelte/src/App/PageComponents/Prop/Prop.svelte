<script lang="ts">
    import type { ShapeArrowAim } from "@thewaver/ss-utils";
    import { Button } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.css";

    import PagePropHintBadge from "../../StyledComponents/PropHintBadge/PropHintBadge.svelte";
    import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { setFieldDefaultContext } from "../Field/FieldSvelte.context";
    import type { PagePropProps } from "./Prop.types";
    import {
        EMPTY_TEXT,
        HINT_OFFSET,
        HINT_PLACEMENT,
        MEMBER_SEPARATOR,
        SINGLE_FIELD,
    } from "@thewaver/ss-playground/App/PageComponents/Prop/Prop.const";

    const toDefaultText = (value: unknown) => {
        if (typeof value === "boolean") return value ? "on" : "off";
        if (typeof value === "number") return String(value);
        if (typeof value === "string" && value !== EMPTY_TEXT) return value;

        return undefined;
    };

    let props: PagePropProps = $props();

    const controlsParts = $derived(props.controls.split(MEMBER_SEPARATOR));

    let reported = $state.raw<{ value: unknown }[]>([]);

    setFieldDefaultContext({
        report: (value) => {
            const entry = { value };

            reported = [...reported, entry];

            return () => {
                reported = reported.filter((candidate) => candidate !== entry);
            };
        },
    });

    const reportedDefault = $derived(reported.length === SINGLE_FIELD ? reported[0].value : undefined);

    const defaultText = $derived(
        toDefaultText(props.defaultValue === undefined ? reportedDefault : props.defaultValue),
    );
</script>

<div
    class={styles.propRow}
    data-prop=""
    data-testid={props.itemKey}
>
    <div class={styles.propLabel}>
        {props.label}

        <Button
            ariaLabel={`About ${props.label}`}
            tooltipDefs={{ placement: HINT_PLACEMENT, offset: HINT_OFFSET, renderContent: hintTooltip }}
        >
            {#snippet renderContent(flags)}
                <PagePropHintBadge {flags} />
            {/snippet}
        </Button>
    </div>

    {@render props.children?.()}
</div>

{#snippet hintTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>
        {props.hint}

        <div class={styles.propHintControls} data-hint-controls="">
            {#each controlsParts as part, index}{#if index > 0}{MEMBER_SEPARATOR}<wbr />{/if}{part}{/each}
        </div>

        {#if defaultText}
            <div class={styles.propHintDefault}>{`Default: ${defaultText}`}</div>
        {/if}
    </PageTooltipContent>
{/snippet}
