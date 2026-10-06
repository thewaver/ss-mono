<script lang="ts">
    import { Button, SLOT_TEXT_DEFAULTS, SlotTextReels } from "@thewaver/ss-components-svelte";
    import type { SlotTextLetterRoute, SlotTextMechanism } from "@thewaver/ss-components-svelte";
    import { SlotTextKnobs } from "@thewaver/ss-playground/App/Knobs/SlotTexts.const";
    import { WORDS } from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import PageControlButtonContent from "../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import CounterExample from "./Examples/Counter.svelte";
    import ReelsExample from "./Examples/Reels.svelte";
    import SplitFlapExample from "./Examples/SplitFlap.svelte";
    import WordsExample from "./Examples/Words.svelte";
    import type { SlotTextExampleProps } from "./SlotTextPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/SlotTextPage/Examples";

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

    const STEPS = [
        { id: "stepDown", flapId: "flapStepDown", label: `take ${SMALL_STEP}`, delta: -SMALL_STEP },
        { id: "stepUp", flapId: "flapStepUp", label: `add ${SMALL_STEP}`, delta: SMALL_STEP },
        { id: "jumpUp", flapId: "flapJumpUp", label: `add ${BIG_STEP}`, delta: BIG_STEP },
    ];

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

    let value = $state(SlotTextKnobs.STARTING_VALUE);
    let turnMs = $state(SLOT_TEXT_DEFAULTS.turnDurationMs);
    let cascadeMs = $state(SLOT_TEXT_DEFAULTS.turnDelayMs);
    let reelValue = $state(STARTING_REEL_VALUE);
    let reelKey = $state<SlotTextReels.SampleKey>(SlotTextKnobs.STARTING_REEL_KEY);
    let wordIndex = $state(FIRST);
    let wordMechanism = $state<SlotTextMechanism>(SlotTextKnobs.STARTING_WORD_MECHANISM);
    let letterRoute = $state<SlotTextLetterRoute>(SlotTextKnobs.STARTING_LETTER_ROUTE);

    const step = (delta: number) => {
        value = Math.min(Math.max(value + delta, SlotTextKnobs.MIN_VALUE), SlotTextKnobs.MAX_VALUE);
    };

    const commonProps: SlotTextExampleProps = $derived({
        text: group(value),
        turnDurationMs: turnMs,
        turnDelayMs: cascadeMs,
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
        {
            key: "splitFlap",
            name: "Departures board",
            readout: () =>
                "the counter's number on flaps: each column drops one flap after another through every digit between the old one and the new, the top half of the digit going falling to uncover the bottom half of the digit coming; a column that carries waits for the one to its right, and a column whose digit has not changed does not flip",
            component: splitFlapExample,
            path: `${EXAMPLES_ROOT}/SplitFlap.svelte`,
        },
        {
            key: "words",
            name: "Words, a letter at a time",
            readout: () =>
                `showing: ${WORDS[wordIndex].trim()} — every letter is a column of its own that turns through the alphabet to its next letter, with the words padded by spaces so no column comes or goes; forward always goes on round, as a departures board does, and shortest takes the nearer way`,
            component: wordsExample,
            path: `${EXAMPLES_ROOT}/Words.svelte`,
        },
    ];
</script>

{#snippet stepControls(isFlap: boolean)}
    <div class={styles.controls}>
        {#each STEPS as entry (entry.id)}
            <Button
                id={isFlap ? entry.flapId : entry.id}
                onClick={() => {
                    step(entry.delta);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageControlButtonContent {flags}>{entry.label}</PageControlButtonContent>
                {/snippet}
            </Button>
        {/each}
    </div>
{/snippet}

{#snippet counterExample()}
    <div class={styles.stack}>
        <PageMeasureBox>
            <div class={styles.line}>
                <CounterExample {...commonProps} />
            </div>
        </PageMeasureBox>

        {@render stepControls(false)}
    </div>
{/snippet}

{#snippet reelsExample()}
    <div class={styles.stack}>
        <PageMeasureBox>
            <div class={styles.line}>
                <ReelsExample text={pad(reelValue)} {reelKey} />
            </div>
        </PageMeasureBox>

        <div class={styles.controls}>
            <Button
                id={"pullReels"}
                onClick={() => {
                    reelValue = pull(reelValue);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageControlButtonContent {flags}>Pull</PageControlButtonContent>
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
                values={SlotTextReels.SAMPLE_KEYS}
                width={FIELD_WIDTH}
                ariaLabel={"Reel"}
                onChange={(next) => {
                    reelKey = next;
                }}
            />
        </PageProp>
    </PageExampleKnobs>
{/snippet}

{#snippet splitFlapExample()}
    <div class={styles.stack}>
        <PageMeasureBox>
            <div class={styles.line}>
                <SplitFlapExample {...commonProps} />
            </div>
        </PageMeasureBox>

        {@render stepControls(true)}
    </div>
{/snippet}

{#snippet wordsExample()}
    <div class={styles.stack}>
        <PageMeasureBox>
            <div class={styles.line}>
                <WordsExample {...commonProps} text={WORDS[wordIndex]} mechanism={wordMechanism} {letterRoute} />
            </div>
        </PageMeasureBox>

        <div class={styles.controls}>
            <Button
                id={"nextWord"}
                ariaLabel={"Next word"}
                onClick={() => {
                    wordIndex = (wordIndex + 1) % WORDS.length;
                }}
            >
                {#snippet renderContent(flags)}
                    <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.next} />
                {/snippet}
            </Button>
        </div>
    </div>

    <PageExampleKnobs>
        <PageProp
            itemKey={"mechanism"}
            label={"Mechanism"}
            hint={"Whether each letter turns on a drum or drops through flaps."}
        >
            <PageSelectField
                value={wordMechanism}
                values={SlotTextKnobs.MECHANISMS}
                width={FIELD_WIDTH}
                ariaLabel={"Mechanism"}
                onChange={(next) => {
                    wordMechanism = next;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"letterRoute"}
            label={"Letter route"}
            hint={
                "Forward always goes on round the alphabet, so C to Z passes every letter between; shortest takes the nearer way, so C to Z goes back three."
            }
        >
            <PageSelectField
                value={letterRoute}
                values={SlotTextKnobs.LETTER_ROUTES}
                width={FIELD_WIDTH}
                ariaLabel={"Letter route"}
                onChange={(next) => {
                    letterRoute = next;
                }}
            />
        </PageProp>
    </PageExampleKnobs>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"value"}
        label={"Value"}
        hint={"The number the counter and the departures board show. Changing it is what starts them turning."}
    >
        <PageNumberField
            {value}
            min={SlotTextKnobs.MIN_VALUE}
            max={SlotTextKnobs.MAX_VALUE}
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
        hint={"How long one column takes to turn from its old character to its new one."}
    >
        <PageNumberField
            value={turnMs}
            min={SlotTextKnobs.MIN_TURN_MS}
            max={SlotTextKnobs.MAX_TURN_MS}
            step={SlotTextKnobs.TURN_STEP_MS}
            ariaLabel={"Turn duration in milliseconds"}
            onInput={(next) => {
                turnMs = next;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"turnDelayMs"}
        label={"Turn delay (ms)"}
        hint={
            "How long each column waits after the turning column beside it starts, which is what makes the turn ripple along."
        }
    >
        <PageNumberField
            value={cascadeMs}
            min={SlotTextKnobs.MIN_CASCADE_MS}
            max={SlotTextKnobs.MAX_CASCADE_MS}
            step={SlotTextKnobs.CASCADE_STEP_MS}
            ariaLabel={"Turn delay in milliseconds"}
            onInput={(next) => {
                cascadeMs = next;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
