//input
const allCvtButtons = document.querySelectorAll(".cvtButton");
for (const cvtButton of allCvtButtons) {

    cvtButton.addEventListener("click", (event) => {
        event.preventDefault();

        let toConvert = event.target.id;
        let text = document.querySelector("#text").value;

        tools[toConvert](text);

        backup.add(text);

        scrollToTextArea();
    })

}

const allbackupButtons = document.querySelectorAll(".backupButton");
for (const backupButton of allbackupButtons) {

    backupButton.addEventListener("click", (event) => {

        let command;
        if (event.target.localName === "button") {  
            command = event.target.id;
        } else {
            command = event.target.parentElement.id;
        }

        let text = document.querySelector("#text").value;

        backup[command](text);
    })

}

const copyButton = document.querySelector("#copy");
copyButton.addEventListener("click", () => {

    document.querySelector("#text").select();
    document.execCommand("copy");

})

//tools
var tools = {

    output: document.querySelector("#text"),

    cvtToUpperCase: text => {

        tools.output.value = text.toUpperCase();

    },

    cvtToLowerCase: text => {

        tools.output.value = text.toLowerCase();

    },

    cvtToAlternated: text => {

        let editing = "";

        for (let i = 0; i < text.length; i++) {

            if (i % 2 === 0) {
                editing = editing + text.slice(i, i + 1).toUpperCase();
            } else {
                editing = editing + text.slice(i, i + 1).toLowerCase();
            }

        }

        text = editing;
        tools.output.value = text;
    },

    cvtToInverted: text => {

        let editing = "";

        for (let i = text.length; i > 0; i--) {

            editing = editing + text.slice(i - 1, i);

        }

        text = editing;
        tools.output.value = text;
    },

    cvtToUp1stLetterWord: text => {

        let editing = " " + text.toLowerCase() + ".";

        let regExp1stLetterWord = /( |\"|\'|\“|\(|\[|\{|\n+)([a-zà-ú])/gi

        editing = editing.replace(regExp1stLetterWord, $0 => $0.toUpperCase());

        let filterInput = document.querySelector("#filterInput").value.toLowerCase();
        let ignoreWords = [];

        filterInput.replace(/[a-zà-ú]*/g, $0 => {

            if ($0) { ignoreWords.push($0); }

        });

        ignoreWords = "([^a-zà-ú])(" + ignoreWords.join("|") + ")([^a-zà-ú])(" + ignoreWords.join("|") + ")?";
        let regExpDynamic = new RegExp(ignoreWords, "gi");

        editing = editing.replace(regExpDynamic, $0 => $0.toLowerCase());
        editing = editing.replace(/[a-zà-ú]/i, $0 => $0.toUpperCase());

        text = editing.slice(1, editing.length - 1);
        tools.output.value = text;

    },

    cvtToUp1stLetterPhrase: text => {

        let editing = " " + text.toLowerCase() + ".";

        let regExpPhrase = /( |\"|\'|\“|\(|\[|\{|\n+)([a-zà-ú])(.+?)(\.+?|\?+?|\!+?|\n+?)/gi

        editing = editing.replace(regExpPhrase, ($0, $1, $2, $3, $4) => {

            let startPhrase = $2;
            startPhrase = startPhrase.toUpperCase();
            return $1 + startPhrase + $3 + $4;

        });

        text = editing.slice(1, editing.length - 1);
        tools.output.value = text;
    },

    cvtToCamelCase: text => {

        let editing = text.toLowerCase();

        let regExpAccentedChar = /([à-ã]*)([è-ê]*)([ì-î]*)([ò-õ]*)([ù-û]*)(ç*)/g;

        editing = editing.replace(regExpAccentedChar, ($0, $1, $2, $3, $4, $5, $6) => {

            if ($0) {
                $1 = $1 ? "a" : "";
                $2 = $2 ? "e" : "";
                $3 = $3 ? "i" : "";
                $4 = $4 ? "o" : "";
                $5 = $5 ? "u" : "";
                $6 = $6 ? "c" : "";
            }

            return $1 + $2 + $3 + $4 + $5 + $6;
        })

        editing = editing.match(/[\w$]+/g);

        let regExp1stLetterWord = /([\d_$]*)([a-z]?)([\w$]*)/;
        let words1stLetterUp = [];


        for (i = 0; i < editing.length; i++) {

            word = editing[i];

            treatedWord = word.replace(regExp1stLetterWord, ($0, $1, $2, $3) => {

                if (!$1) {
                    $2 = $2.toUpperCase();
                }

                return $1 + $2 + $3;
            });

            words1stLetterUp.push(treatedWord);
        }

        editing = words1stLetterUp;

        let regExpFirstWord = /([0-9]*)([\w$]?)([\w$]*)/;

        for (let i = 0; i < editing.length; i++) {

            editing[i] = editing[i].replace(regExpFirstWord, ($0, $1, $2, $3) => {
                $2 = $2.toLowerCase();
                return $2 + $3;
            });

            if (editing[i]) {
                break;
            }

        }

        text = editing.join("");
        tools.output.value = text;
    }

}


//Backup Texts
var backup = {

    versions: [],

    selector: -1,

    add: textBeforeTool => {

        let textAfterTool = document.querySelector("#text").value;

        if (textAfterTool != textBeforeTool) {

            while (backup.versions[backup.selector + 1]) {

                backup.versions.pop();

            }

            if (textBeforeTool != backup.versions[backup.selector]) {

                backup.versions.push(textBeforeTool);
                backup.selector = backup.selector + 1;

            }

            backup.versions.push(textAfterTool);
            backup.selector = backup.selector + 1;

        }

    },

    undo: () => {

        if (backup.selector > 0) {

            backup.selector = backup.selector - 1;
            document.querySelector("#text").value = backup.versions[backup.selector];

        }
    },

    redo: () => {

        if (backup.selector < backup.versions.length - 1) {

            backup.selector = backup.selector + 1;
            document.querySelector("#text").value = backup.versions[backup.selector];

        }
    }

};



//Page
function scrollToTextArea() {
    let bodyPosition = document.querySelector("body").getBoundingClientRect().y*-1;
    let navigationPosition = document.querySelector(".navigation").getBoundingClientRect().y;
    let newPositionPage = (bodyPosition + navigationPosition);

    window.scrollTo(0, newPositionPage);
}
