export const BUDGET_MAX = 5000;

export const EXAMPLE_NAMES = {
    default: "Default",
    empty: "Empty",
    symbol: "With a symbol",
    bounded: "Bounded",
    negative: "Signed",
    big: "Many groups",
};

export const LOCALE_FIELD_WIDTH = 120;

export const LOCALE_GROUPING = "locale";

export const EXAMPLES_ROOT = "/src/App/Pages/CurrencyInputPage/Examples";

export const STARTING_PRICE = 1234.56;

export const STARTING_BUDGET = 4999.99;

export const STARTING_BIG = 9876543210.12;

export const STARTING_ADJUSTMENT = -250.5;

export const DOCS_ROOT = "/src/App/Pages/CurrencyInputPage/Docs";

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the leading slot, here the symbol, sits on the right and the amount starts beside it, while the digits keep their own order.",
    },
    writtenLocalWay: {
        title: "Written the local way",
        content:
            "Give it a [prop]locale[/prop] and the amount is written the way that place writes money: which separators, and in which groups. The [prop]decimals[/prop] say how many digits follow the separator, and [prop]groupSizes[/prop] overrides the locale's grouping, such as the Indian pattern of a group of three and then groups of two. However many groups the amount needs, it gets.",
    },
    symbol: {
        title: "With a symbol",
        content:
            "The field keeps no list of currencies, so the symbol is yours to draw, in the leading or the trailing slot, on whichever side your locale puts it.",
    },
    limit: {
        title: "A limit",
        content:
            "Give it a [prop]max[/prop] and any amount above it is refused as it is typed, so the field never holds more.",
    },
    negativeAmounts: {
        title: "Negative amounts",
        content:
            "With [prop]hasSign[/prop] on, a minus can be typed and the amount can go below zero. Off, the default, a minus is refused.",
    },
};
