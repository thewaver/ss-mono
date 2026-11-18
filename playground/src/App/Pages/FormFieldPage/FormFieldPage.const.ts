export const EXAMPLE_NAMES = {
    default: "Around a control of the library's",
    foreign: "Around a control it has never seen",
    inForm: "Inside a form",
};

export const EXAMPLES_ROOT = "/src/App/Pages/FormFieldPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/FormFieldPage/Docs";

export const FIELD_WIDTH = 110;

export const MESSAGE_WIDTH = 240;

export const DOCS_SECTIONS = {
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the caption, the field and the message line up on the right, and what is typed starts from the right of the field. With [prop]orientation[/prop] set to horizontal, the caption sits to the right of the field instead.",
    },
    insideForm: {
        title: "Inside a form",
        content:
            "A field inside a Form reports to it, so the form's [prop]isValid[/prop] is false while the field's [prop]hasError[/prop] is on, and the line under the button says so; nothing here hands the field's state to the form. Saving while the error is on moves focus to the field.",
    },
};

export const MESSAGE = "Shown to everyone who can see your posts.";

export const HINT = "Shown to everyone who can see your posts.";

export const ERROR = "That name is already taken.";

export const SOME_FIELDS_NEED_ATTENTION_TEXT = "Some fields need attention.";

export const RIGHT_TO_LEFT_MESSAGE = "Shown to everyone who can see your posts";
