export const PIN_LENGTH = 6;
export const QUANTITY_MIN = 0;
export const QUANTITY_MAX = 100;
export const QUANTITY_STEP = 5;

export const CITIES = [
    { name: "Aarhus", country: "Denmark" },
    { name: "Amsterdam", country: "Netherlands" },
    { name: "Antwerp", country: "Belgium" },
    { name: "Bergen", country: "Norway" },
    { name: "Braga", country: "Portugal" },
    { name: "Bruges", country: "Belgium" },
    { name: "Copenhagen", country: "Denmark" },
    { name: "Gothenburg", country: "Sweden" },
    { name: "Helsinki", country: "Finland" },
    { name: "Lisbon", country: "Portugal" },
    { name: "Malmö", country: "Sweden" },
    { name: "Oslo", country: "Norway" },
    { name: "Porto", country: "Portugal" },
    { name: "Rotterdam", country: "Netherlands" },
    { name: "Stockholm", country: "Sweden" },
    { name: "Tallinn", country: "Estonia" },
    { name: "Tampere", country: "Finland" },
    { name: "Tartu", country: "Estonia" },
];

export const EXAMPLE_NAMES = {
    default: "Default",
    transformingSetter: "Transforming setter",
    refusingSetter: "Refusing setter",
    suggestions: "Suggestions",
    editable: "Edit in place",
    password: "Password",
    bothAdornments: "Both adornments",
    number: "Number",
    readOnly: "Read-only",
    disabled: "Disabled",
    reachable: "Disabled + reachable",
    errored: "Error",
    label: "In a Label",
};

export const EXAMPLES_ROOT = "/src/App/Pages/TextInputPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/TextInputPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the field turns round with it: what is typed and the placeholder start from the right, the leading content sits on the right and the trailing content on the left, and the sides of [prop]padding[/prop] are where the text starts and ends rather than the screen's left and right.",
    },
    rewritingWhatTyped: {
        title: "Rewriting what is typed",
        content:
            "Every change also runs [prop]onInput[/prop], and whatever it writes to the value is what the field shows. Here every letter is upper-cased on the way in, and the caret stays where it was, even when typing in the middle.",
    },
    refusingWhatTyped: {
        title: "Refusing what is typed",
        content:
            "Writing less than was typed from [prop]onInput[/prop] refuses the rest. This PIN keeps digits only, no more than six of them, and reports an error while it holds fewer than six.",
    },
    leadingTrailingContent: {
        title: "Leading and trailing content",
        content:
            "Content can sit inside the field, before and after the text, through [prop]renderLeading[/prop] and [prop]renderTrailing[/prop]: a unit, an icon, or a control of its own, such as this Clear button.",
    },
    passwords: {
        title: "Passwords",
        content:
            "A [prop]type[/prop] of password hides the text, and switching it to text shows it again, here from a trailing button. Give it an [prop]autoComplete[/prop] so password managers know what to fill.",
    },
    numbers: {
        title: "Numbers",
        content:
            "A [prop]type[/prop] of number takes [prop]min[/prop], [prop]max[/prop] and [prop]step[/prop], and the up and down arrows step the value. It draws no buttons to step with; NumberInput is the field that does.",
    },
    suggestions: {
        title: "Suggestions",
        content:
            "Give it [prop]suggestions[/prop] and it becomes a combobox: typing opens a list under it, with nothing highlighted, so Enter keeps exactly what was typed. The arrows walk the list and Enter then writes the highlighted suggestion; Escape closes the list and leaves the text alone. Any text is allowed, so filtering the list is yours.",
    },
    tooltip: {
        title: "Tooltip",
        content:
            "Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing.",
    },
    namedLabel: {
        title: "Named by a Label",
        content:
            "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field.",
    },
    editingPlace: {
        title: "Editing in place",
        content:
            "A field can stand in for a button while it is being edited. Pressing the name swaps it for a field holding the current text, already focused; Enter or leaving the field keeps the edit, Escape puts the old text back, and either way focus returns to the button.",
    },
};

export const FIELD_TOOLTIP_LABEL = "Field with a tooltip";
