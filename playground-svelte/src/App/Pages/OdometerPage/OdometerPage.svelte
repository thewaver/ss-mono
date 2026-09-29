<script lang="ts">
    import { Button, ODOMETER_DEFAULTS, OdometerReels } from "@thewaver/ss-components-svelte";
    import { OdometerKnobs } from "@thewaver/ss-playground/App/Knobs/Odometers.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import CounterExample from "./Examples/Counter.svelte";
    import ReelsExample from "./Examples/Reels.svelte";
    import type { OdometerExampleProps } from "./OdometerPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/OdometerPage/Examples";

    const ZERO = 0;
    const SMALL_STEP = 1;
    const BIG_STEP = 137;
    const GROUP_SIZE = 3;
    const FIRST = 0;
    const REEL_DIGITS = 4;
    const REEL_PAD = "0";
    const REEL_RANGE = 10 ** REEL_DIGITS;
    const STARTING_REEL_VALUE = 7;
    const FIELD_WIDTH = 130;

    const group = (value: number) => {
        const digits = String(Math.abs(value));
        const grouped = Array.from(digits)
            .map((digit, index) => ((digits.length - index) % GROUP_SIZE === 0 && index > FIRST ? `,${digit}` : digit))
            .join("");

        return value < ZERO ? `-${grouped}` : grouped;
    };

    const pad = (value: number) => String(value).padStart(REEL_DIGITS, REEL_PAD);

    const pull = (value: number) => {
        const next = Math.floor(Math.random() * REEL_RANGE);

        return next === value ? (next + SMALL_STEP) % REEL_RANGE : next;
    };

    let value = $state(OdometerKnobs.STARTING_VALUE);
    let turnMs = $state(ODOMETER_DEFAULTS.turnDurationMs);
    let cascadeMs = $state(ODOMETER_DEFAULTS.cascadeDelayMs);
    let reelValue = $state(STARTING_REEL_VALUE);
    let reelKey = $state<OdometerReels.SampleKey>(OdometerKnobs.STARTING_REEL_KEY);

    const step = (delta: number) => {
        value = Math.min(Math.max(value + delta, OdometerKnobs.MIN_VALUE), OdometerKnobs.MAX_VALUE);
    };

    const commonProps: OdometerExampleProps = $derived({
        text: group(value),
        turnDurationMs: turnMs,
        cascadeDelayMs: cascadeMs,
    });

    const examples: ExampleDefs[] = [
        {
            key: "counter",
            name: "Counter",
            readout: () =>
                "every column that has to carry waits for the one to its right, a column going nine to zero keeps turning forward rather than rewinding, and crossing zero turns the whole number back the other way, and a digit or separator arriving or going grows in or shrinks away while it fades",
            component: counterExample,
            path: `${EXAMPLES_ROOT}/Counter.svelte`,
        },
        {
            key: "reels",
            name: "Reels",
            readout: () =>
                "every column spins at once and stops in the order its reel gives, taking extra whole turns on the way; with less motion asked for it only turns as far as its digit needs",
            component: reelsExample,
            path: `${EXAMPLES_ROOT}/Reels.svelte`,
        },
    ];
</script>

{#snippet counterExample()}
    <div class={styles.stack}>
        <CounterExample {...commonProps} />

        <div class={styles.controls}>
            <Button
                id={"stepDown"}
                onClick={() => {
                    step(-SMALL_STEP);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>{`take ${SMALL_STEP}`}</PageButtonContent>
                {/snippet}
            </Button>

            <Button
                id={"stepUp"}
                onClick={() => {
                    step(SMALL_STEP);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>{`add ${SMALL_STEP}`}</PageButtonContent>
                {/snippet}
            </Button>

            <Button
                id={"jumpUp"}
                onClick={() => {
                    step(BIG_STEP);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>{`add ${BIG_STEP}`}</PageButtonContent>
                {/snippet}
            </Button>
        </div>
    </div>
{/snippet}

{#snippet reelsExample()}
    <div class={styles.stack}>
        <ReelsExample text={pad(reelValue)} {reelKey} />

        <div class={styles.controls}>
            <Button
                id={"pullReels"}
                onClick={() => {
                    reelValue = pull(reelValue);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>Pull</PageButtonContent>
                {/snippet}
            </Button>
        </div>
    </div>

    <PageExampleKnobs>
        <PageProp
            itemKey={"reelKey"}
            label={"Reel"}
            hint={
                "How many extra turns each column makes and how long it takes, which decides the order the columns stop in."
            }
        >
            <PageSelectField
                value={reelKey}
                values={OdometerReels.SAMPLE_KEYS}
                width={FIELD_WIDTH}
                ariaLabel={"Reel"}
                onChange={(next) => {
                    reelKey = next;
                }}
            />
        </PageProp>
    </PageExampleKnobs>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"value"}
        label={"Value"}
        hint={"The number the odometer is counting to. Changing it is what starts the digits turning."}
    >
        <PageNumberField
            {value}
            min={OdometerKnobs.MIN_VALUE}
            max={OdometerKnobs.MAX_VALUE}
            step={SMALL_STEP}
            ariaLabel={"Value"}
            onInput={(next) => {
                value = next;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"turnDurationMs"}
        label={"Turn (ms)"}
        hint={"How long one digit takes to turn from its old face to its new one."}
    >
        <PageNumberField
            value={turnMs}
            min={OdometerKnobs.MIN_TURN_MS}
            max={OdometerKnobs.MAX_TURN_MS}
            step={OdometerKnobs.TURN_STEP_MS}
            ariaLabel={"Turn duration in milliseconds"}
            onInput={(next) => {
                turnMs = next;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"cascadeDelayMs"}
        label={"Cascade (ms)"}
        hint={
            "How long each digit waits after the one beside it starts, which is what makes the turn ripple along."
        }
    >
        <PageNumberField
            value={cascadeMs}
            min={OdometerKnobs.MIN_CASCADE_MS}
            max={OdometerKnobs.MAX_CASCADE_MS}
            step={OdometerKnobs.CASCADE_STEP_MS}
            ariaLabel={"Cascade delay in milliseconds"}
            onInput={(next) => {
                cascadeMs = next;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
