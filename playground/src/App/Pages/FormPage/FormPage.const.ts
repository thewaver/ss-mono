export const EXAMPLE_NAMES = {
    reportsValidity: "A form that reports its own validity",
    focusOnError: "Submitting moves focus to the first error",
};

export const EXAMPLES_ROOT = "/src/App/Pages/FormPage/Examples";

export const DOCS_ROOT = "/src/App/Pages/FormPage/Docs";

export const DOCS_SECTIONS = {
    errorsWhileTyping: {
        title: "Errors shown as you type",
        content:
            "Each field works out its own error from what is in it, so the password's rule shows from the start and the email complains as soon as what is typed has no @. The content's [prop]isValid[/prop] is true while no field reports an error, and drives the line under the buttons. The submit handler runs either way, since whether to send is yours to decide; once it returns, focus moves to the first field reporting an error, in the order the fields were drawn.",
    },
    errorsShownOnceForm: {
        title: "Errors shown once the form is sent",
        content:
            "The content's [prop]hasSubmitted[/prop] turns true on the first submit, so an error such as a field left empty can wait until then rather than greet the reader: this form looks clean until Subscribe is pressed, and then shows every error at once.",
    },
    readingWhatWasSent: {
        title: "Reading what was sent",
        content:
            "The submit handler is handed the form's entries, read the way the browser would have sent them: every field with a [prop]name[/prop], under that name. A date arrives as an ISO date whatever format the field shows, a multiple select as one entry per pick under its one name, so it is read with getAll, and a single select left empty as an empty entry. A field with no name sends nothing.",
    },
};

export const DOES_NOT_LOOK_LIKE_TEXT = "That does not look like an email address.";

export const WE_ONLY_USE_SIGN_TEXT = "We only use it to sign you in.";

export const SOME_FIELDS_NEED_ATTENTION_TEXT = "Some fields need attention.";

export const PICK_LEAST_ONE_TOPIC_TEXT = "Pick at least one topic.";
