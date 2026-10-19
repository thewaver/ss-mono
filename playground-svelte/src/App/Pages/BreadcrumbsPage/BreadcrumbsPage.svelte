<script lang="ts">
    import type { Breadcrumb } from "@thewaver/ss-components-svelte";
    import { Button } from "@thewaver/ss-components-svelte";
    import { BreadcrumbKnobs } from "@thewaver/ss-playground/App/Knobs/Breadcrumbs.const";
    import type { CrumbValue } from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbTrail.types";
    import {
    DEPTH_FIELD_WIDTH,
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    TRAIL,
} from "@thewaver/ss-playground/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { BreadcrumbsExampleProps } from "./BreadcrumbsPageSvelte.types";
    import BareExample from "./Examples/Bare.svelte";
    import LinkComponentExample from "./Examples/LinkComponent.svelte";
    import LinkedExample from "./Examples/Linked.svelte";
    import TrailExample from "./Examples/Trail.svelte";

    let depth = $state(BreadcrumbKnobs.STARTING_DEPTH);
    let isDisabled = $state(BreadcrumbKnobs.STARTING_IS_DISABLED);

    let pressed = $state<CrumbValue | undefined>(undefined);
    let linkPressed = $state<CrumbValue | undefined>(undefined);

    const crumbs: Breadcrumb<CrumbValue>[] = $derived(
        TRAIL.slice(0, depth).map((entry) => ({ value: entry.value, isDisabled })),
    );

    const linkCrumbs: Breadcrumb<CrumbValue>[] = $derived(
        TRAIL.slice(0, depth).map((entry) => ({
            value: entry.value,
            href: `#breadcrumb-${entry.value}`,
            isDisabled,
        })),
    );

    const navigate = (value: CrumbValue) => {
        depth = TRAIL.findIndex((entry) => entry.value === value) + 1;
    };

    const reset = () => {
        depth = BreadcrumbKnobs.STARTING_DEPTH;
        pressed = undefined;
        linkPressed = undefined;
    };

    const commonProps: BreadcrumbsExampleProps = $derived({ crumbs });

    const examples: ExampleDefs[] = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () =>
                `pressed: ${pressed ?? "nothing yet"} — pressing a crumb moves the page there, so the trail behind it is the whole trail; Reset puts it back`,
            component: defaultExample,
            path: `${EXAMPLES_ROOT}/Trail.svelte`,
        },
        {
            key: "bare",
            name: EXAMPLE_NAMES.bare,
            readout: () => "a trail with nothing between the crumbs, since the separator slot is optional",
            component: bareExample,
            path: `${EXAMPLES_ROOT}/Bare.svelte`,
        },
        {
            key: "linked",
            name: EXAMPLE_NAMES.linked,
            readout: () => `pressed: ${linkPressed ?? "nothing yet"} — an href makes a crumb an anchor`,
            component: linkedExample,
            path: `${EXAMPLES_ROOT}/Linked.svelte`,
        },
        {
            key: "linkComponent",
            name: EXAMPLE_NAMES.linkComponent,
            readout: () => "the same links rendered by a consumer's own link component",
            component: linkComponentExample,
            path: `${EXAMPLES_ROOT}/LinkComponent.svelte`,
        },
    ];
</script>

{#snippet defaultExample()}
    <TrailExample
        {...commonProps}
        onSelect={(value) => {
            pressed = value;
            navigate(value);
        }}
    />
{/snippet}

{#snippet bareExample()}
    <BareExample {...commonProps} />
{/snippet}

{#snippet linkedExample()}
    <LinkedExample
        crumbs={linkCrumbs}
        onSelect={(value) => {
            linkPressed = value;
            navigate(value);
        }}
    />
{/snippet}

{#snippet linkComponentExample()}
    <LinkComponentExample crumbs={linkCrumbs} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"depth"}
        controls={"Sets the length of the slice of example crumbs sent to BreadcrumbsProps.crumbs"}
        label={"Depth"}
        hint={"How many crumbs the trail holds. Past what fits, the middle ones collapse behind a menu."}
    >
        <PageNumberField
            value={depth}
            min={BreadcrumbKnobs.MIN_DEPTH}
            max={BreadcrumbKnobs.MAX_DEPTH}
            step={BreadcrumbKnobs.DEPTH_STEP}
            width={DEPTH_FIELD_WIDTH}
            ariaLabel={"Depth"}
            onInput={(value) => {
                depth = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isDisabled"}
        controls={"Sets Breadcrumb.isDisabled on every example crumb sent to BreadcrumbsProps.crumbs"}
        label={"Disabled"}
        hint={"Turns every crumb off. A disabled crumb stays readable and keeps its tooltip."}
    >
        <PageCheckField
            value={isDisabled}
            ariaLabel={"Disabled"}
            onChange={(value) => {
                isDisabled = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"trail"}
        controls={"Writes the starting depth back to the slice of example crumbs sent to BreadcrumbsProps.crumbs"}
        label={"Trail"}
        hint={"Puts the trail back to the crumb it started on, undoing wherever the examples have navigated to."}
    >
        <Button
            onClick={async () => {
                reset();
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Reset</PageButtonContent>
            {/snippet}
        </Button>
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
