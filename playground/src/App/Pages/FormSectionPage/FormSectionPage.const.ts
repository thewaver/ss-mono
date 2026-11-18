export const EXAMPLE_NAMES = {
    sections: "Sections with their own validity",
    nested: "A section inside a section",
};

export const EXAMPLES_ROOT = "/src/App/Pages/FormSectionPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/FormSectionPage/Docs";

export const DOCS_SECTIONS = {
    groupRule: {
        title: "A rule that belongs to the group",
        content:
            "Each field reports to the section it sits in, and the section reports one answer to the form: valid while none of its fields is in error and its own [prop]hasError[/prop] is off. That own error is for a rule no single field can carry, such as two passwords that must match: both fields are fine on their own, and the section still says no, through its [prop]message[/prop], which is read out when it appears and describes the group afterwards. The form's [prop]isValid[/prop] drives the line under the buttons, and sending moves focus to the first field in error, or, when only the section's own rule fails, to the first field in that section.",
    },
    rightLeft: {
        title: "Right to left",
        content:
            "Inside a box whose text runs right to left, the legend and the fields line up on the right, and what is typed starts from the right of each field.",
    },
    sectionInsideSection: {
        title: "A section inside a section",
        content:
            "Sections nest: here the payment section reports to the delivery section, which reports to the form, so a wrong card number travels up two levels before the form hears it.",
    },
};

export const WE_NEED_SOMEWHERE_SEND_TEXT = "We need somewhere to send it.";

export const SOME_FIELDS_NEED_ATTENTION_TEXT = "Some fields need attention.";

export const MISMATCH_MESSAGE = "The two passwords do not match.";

export const DOES_NOT_LOOK_LIKE_TEXT = "That does not look like an email address.";
