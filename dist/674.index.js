export const id = 674;
export const ids = [674];
export const modules = {

/***/ 4674:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  CommitParser: () => (/* reexport */ CommitParser),
  createCommitObject: () => (/* reexport */ createCommitObject),
  parseCommits: () => (/* reexport */ parseCommits),
  parseCommitsStream: () => (/* reexport */ parseCommitsStream)
});

;// CONCATENATED MODULE: ./node_modules/conventional-commits-parser/dist/regex.js
const nomatchRegex = /(?!.*)/;
function regex_escape(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function joinOr(parts) {
    return parts
        .map(val => (typeof val === 'string' ? regex_escape(val.trim()) : val.source))
        .filter(Boolean)
        .join('|');
}
function getNotesRegex(noteKeywords, notesPattern) {
    if (!noteKeywords) {
        return nomatchRegex;
    }
    const noteKeywordsSelection = joinOr(noteKeywords);
    if (!notesPattern) {
        return new RegExp(`^(?:\\*\\s+)?(${noteKeywordsSelection}):\\s*(.*)`, 'i');
    }
    return notesPattern(noteKeywordsSelection);
}
function getReferencePartsRegex(issuePrefixes, issuePrefixesCaseSensitive) {
    if (!issuePrefixes) {
        return nomatchRegex;
    }
    const flags = issuePrefixesCaseSensitive ? 'g' : 'gi';
    return new RegExp(`(?:.*?)??\\s*([\\w-\\.\\/]*?)??(${joinOr(issuePrefixes)})([\\w-]+)(?=\\s|$|[,;.)\\]])`, flags);
}
function getReferencesRegex(referenceActions, separator = '') {
    if (!referenceActions) {
        // matches everything
        return /()(.+)/gi;
    }
    const joinedKeywords = joinOr(referenceActions);
    // Keywords are whole words: `prefix #1` has no `fix` action,
    // and `fixups` does not end the references of the previous keyword.
    const nextKeyword = `(?<!\\w)(?:${joinedKeywords})(?!\\w)`;
    return new RegExp(`(?<!\\w)(${joinedKeywords})${separator}(?:\\s+(.*?))(?=${nextKeyword}|$)`, 'gi');
}
function getFooterTokenRegex(issuePrefixes) {
    const issuePrefixSeparator = issuePrefixes
        ? `|\\s+(?:${joinOr(issuePrefixes)})`
        : '';
    // Footers follow the git trailer convention: the token starts at the
    // beginning of the line, indented `key: value` lines are not footers.
    return new RegExp(`^(?:BREAKING CHANGE|[\\w-]+)(?::\\s+${issuePrefixSeparator}).+`, 'i');
}
/**
 * Make the regexes used to parse a commit.
 * @param options
 * @returns Regexes.
 */
function getParserRegexes(options = {}) {
    const notes = getNotesRegex(options.noteKeywords, options.notesPattern);
    const referenceParts = getReferencePartsRegex(options.issuePrefixes, options.issuePrefixesCaseSensitive);
    const references = getReferencesRegex(options.referenceActions);
    // In a footer the keyword is a token, which may be followed by a colon: `Closes: #1`
    const footerReferences = getReferencesRegex(options.referenceActions, ':?');
    const footerToken = getFooterTokenRegex(options.issuePrefixes);
    return {
        notes,
        referenceParts,
        references,
        footerReferences,
        footerToken,
        mentions: /@([\w-]+)/g,
        url: /\b(?:https?):\/\/(?:www\.)?([-a-zA-Z0-9@:%_+.~#?&//=])+\b/
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVnZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFBO0FBRTdCLFNBQVMsTUFBTSxDQUFDLE1BQWM7SUFDNUIsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ3RELENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxLQUEwQjtJQUN4QyxPQUFPLEtBQUs7U0FDVCxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkUsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNkLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FDcEIsWUFBNkMsRUFDN0MsWUFBb0Q7SUFFcEQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2xCLE9BQU8sWUFBWSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUVsRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbEIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIscUJBQXFCLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUM1RSxDQUFDO0lBRUQsT0FBTyxZQUFZLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUM1QyxDQUFDO0FBRUQsU0FBUyxzQkFBc0IsQ0FDN0IsYUFBOEMsRUFDOUMsMEJBQStDO0lBRS9DLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNuQixPQUFPLFlBQVksQ0FBQTtJQUNyQixDQUFDO0lBRUQsTUFBTSxLQUFLLEdBQUcsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0lBRXJELE9BQU8sSUFBSSxNQUFNLENBQUMsbUNBQW1DLE1BQU0sQ0FBQyxhQUFhLENBQUMsK0JBQStCLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDbkgsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQ3pCLGdCQUFpRCxFQUNqRCxTQUFTLEdBQUcsRUFBRTtJQUVkLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3RCLHFCQUFxQjtRQUNyQixPQUFPLFVBQVUsQ0FBQTtJQUNuQixDQUFDO0lBRUQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDL0MsNkRBQTZEO0lBQzdELG9FQUFvRTtJQUNwRSxNQUFNLFdBQVcsR0FBRyxjQUFjLGNBQWMsVUFBVSxDQUFBO0lBRTFELE9BQU8sSUFBSSxNQUFNLENBQUMsWUFBWSxjQUFjLElBQUksU0FBUyxtQkFBbUIsV0FBVyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDckcsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQzFCLGFBQThDO0lBRTlDLE1BQU0sb0JBQW9CLEdBQUcsYUFBYTtRQUN4QyxDQUFDLENBQUMsV0FBVyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUc7UUFDckMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUVOLHFFQUFxRTtJQUNyRSxzRUFBc0U7SUFDdEUsT0FBTyxJQUFJLE1BQU0sQ0FBQyx1Q0FBdUMsb0JBQW9CLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUMxRixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FDOUIsT0FBTyxHQUErSCxFQUFFO0lBRXhJLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUN2RSxNQUFNLGNBQWMsR0FBRyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0lBQ3hHLE1BQU0sVUFBVSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQy9ELHFGQUFxRjtJQUNyRixNQUFNLGdCQUFnQixHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUMzRSxNQUFNLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7SUFFOUQsT0FBTztRQUNMLEtBQUs7UUFDTCxjQUFjO1FBQ2QsVUFBVTtRQUNWLGdCQUFnQjtRQUNoQixXQUFXO1FBQ1gsUUFBUSxFQUFFLFlBQVk7UUFDdEIsR0FBRyxFQUFFLDJEQUEyRDtLQUNqRSxDQUFBO0FBQ0gsQ0FBQyJ9
;// CONCATENATED MODULE: ./node_modules/conventional-commits-parser/dist/utils.js
const SCISSOR = '------------------------ >8 ------------------------';
/**
 * Remove leading and trailing newlines.
 * @param input
 * @returns String without leading and trailing newlines.
 */
function trimNewLines(input) {
    // To escape ReDos we should escape String#replace with regex.
    const matches = input.match(/[^\r\n]/);
    if (typeof matches?.index !== 'number') {
        return '';
    }
    const firstIndex = matches.index;
    let lastIndex = input.length - 1;
    while (input[lastIndex] === '\r' || input[lastIndex] === '\n') {
        lastIndex--;
    }
    return input.substring(firstIndex, lastIndex + 1);
}
/**
 * Append a newline to a string.
 * @param src
 * @param line
 * @returns String with appended newline.
 */
function appendLine(src, line) {
    return src ? `${src}\n${line || ''}` : line || '';
}
/**
 * Creates a function that filters out comments lines.
 * @param char
 * @returns Comment filter function.
 */
function getCommentFilter(char) {
    return char
        ? (line) => !line.startsWith(char)
        : () => true;
}
/**
 * Select lines before the scissor.
 * @param lines
 * @param commentChar
 * @returns Lines before the scissor.
 */
function truncateToScissor(lines, commentChar) {
    const scissorIndex = lines.indexOf(`${commentChar} ${SCISSOR}`);
    if (scissorIndex === -1) {
        return lines;
    }
    return lines.slice(0, scissorIndex);
}
/**
 * Filter out GPG sign lines.
 * @param line
 * @returns True if the line is not a GPG sign line.
 */
function gpgFilter(line) {
    return !line.match(/^\s*gpg:/);
}
/**
 * Assign matched correspondence to the target object.
 * @param target - The target object to assign values to.
 * @param matches - The RegExp match array containing the matched groups.
 * @param correspondence - An array of keys that correspond to the matched groups.
 * @returns The target object with assigned values.
 */
function assignMatchedCorrespondence(target, matches, correspondence) {
    const { groups } = matches;
    for (let i = 0, len = correspondence.length, key; i < len; i++) {
        key = correspondence[i];
        target[key] = (groups ? groups[key] : matches[i + 1]) || null;
    }
    return target;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLEdBQUcsc0RBQXNELENBQUE7QUFFdEU7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQUMsS0FBYTtJQUN4Qyw4REFBOEQ7SUFFOUQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUV0QyxJQUFJLE9BQU8sT0FBTyxFQUFFLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUN2QyxPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUM7SUFFRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFBO0lBQ2hDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0lBRWhDLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDOUQsU0FBUyxFQUFFLENBQUE7SUFDYixDQUFDO0lBRUQsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDbkQsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBQyxHQUFrQixFQUFFLElBQXdCO0lBQ3JFLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxJQUFJLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUE7QUFDbkQsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsSUFBd0I7SUFDdkQsT0FBTyxJQUFJO1FBQ1QsQ0FBQyxDQUFDLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQzFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUE7QUFDaEIsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGlCQUFpQixDQUMvQixLQUFlLEVBQ2YsV0FBbUI7SUFFbkIsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFdBQVcsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBRS9ELElBQUksWUFBWSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDeEIsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQTtBQUNyQyxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQUMsSUFBWTtJQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNoQyxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLDJCQUEyQixDQUN6QyxNQUFxQyxFQUNyQyxPQUF5QixFQUN6QixjQUF3QjtJQUV4QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFBO0lBRTFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDL0QsR0FBRyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQTtJQUMvRCxDQUFDO0lBRUQsT0FBTyxNQUFNLENBQUE7QUFDZixDQUFDIn0=
;// CONCATENATED MODULE: ./node_modules/conventional-commits-parser/dist/options.js
const defaultOptions = {
    noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
    issuePrefixes: ['#'],
    referenceActions: [
        'close',
        'closes',
        'closed',
        'fix',
        'fixes',
        'fixed',
        'resolve',
        'resolves',
        'resolved'
    ],
    headerPattern: /^(\w*)(?:\(([\w$@.\-*/ ]*)\))?: (.*)$/,
    headerCorrespondence: [
        'type',
        'scope',
        'subject'
    ],
    revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\.?/,
    revertCorrespondence: ['header', 'hash'],
    // The field name must contain at least one word character so that
    // YAML document markers like `---` are not treated as field markers.
    fieldPattern: /^-(?=.*\w)(.*?)-$/
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBa0I7SUFDM0MsWUFBWSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUM7SUFDcEQsYUFBYSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ3BCLGdCQUFnQixFQUFFO1FBQ2hCLE9BQU87UUFDUCxRQUFRO1FBQ1IsUUFBUTtRQUNSLEtBQUs7UUFDTCxPQUFPO1FBQ1AsT0FBTztRQUNQLFNBQVM7UUFDVCxVQUFVO1FBQ1YsVUFBVTtLQUNYO0lBQ0QsYUFBYSxFQUFFLHVDQUF1QztJQUN0RCxvQkFBb0IsRUFBRTtRQUNwQixNQUFNO1FBQ04sT0FBTztRQUNQLFNBQVM7S0FDVjtJQUNELGFBQWEsRUFBRSxxREFBcUQ7SUFDcEUsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO0lBQ3hDLGtFQUFrRTtJQUNsRSxxRUFBcUU7SUFDckUsWUFBWSxFQUFFLG1CQUFtQjtDQUNsQyxDQUFBIn0=
;// CONCATENATED MODULE: ./node_modules/conventional-commits-parser/dist/CommitParser.js



/**
 * Helper to create commit object.
 * @param initialData - Initial commit data.
 * @returns Commit object with empty data.
 */
function createCommitObject(initialData = {}) {
    // @ts-expect-error: You can read properties from `Commit` without problems, but you can't assign object to this type. So here is helper for that.
    return {
        merge: null,
        revert: null,
        header: null,
        body: null,
        footer: null,
        notes: [],
        mentions: [],
        references: [],
        ...initialData
    };
}
/**
 * Commit message parser.
 */
class CommitParser {
    options;
    regexes;
    lines = [];
    lineIndex = 0;
    commit = createCommitObject();
    constructor(options = {}) {
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.regexes = getParserRegexes(this.options);
    }
    currentLine() {
        return this.lines[this.lineIndex];
    }
    nextLine() {
        return this.lines[this.lineIndex++];
    }
    isLineAvailable() {
        return this.lineIndex < this.lines.length;
    }
    parseReference(input, action) {
        const { regexes } = this;
        if (regexes.url.test(input)) {
            return null;
        }
        const matches = regexes.referenceParts.exec(input);
        if (!matches) {
            return null;
        }
        let [raw, repository = null, prefix, issue] = matches;
        let owner = null;
        if (repository) {
            const slashIndex = repository.indexOf('/');
            if (slashIndex !== -1) {
                owner = repository.slice(0, slashIndex);
                repository = repository.slice(slashIndex + 1);
            }
        }
        return {
            raw,
            action,
            owner,
            repository,
            prefix,
            issue
        };
    }
    parseReferences(input, isFooterToken = false) {
        const { regexes } = this;
        const referencesRegex = isFooterToken
            ? regexes.footerReferences
            : regexes.references;
        const regex = input.match(referencesRegex)
            ? referencesRegex
            : /()(.+)/gi;
        const references = [];
        let matches;
        let action;
        let sentence;
        let reference;
        while (true) {
            matches = regex.exec(input);
            if (!matches) {
                break;
            }
            action = matches[1] || null;
            sentence = matches[2] || '';
            while (true) {
                reference = this.parseReference(sentence, action);
                if (!reference) {
                    break;
                }
                references.push(reference);
            }
        }
        return references;
    }
    skipEmptyLines() {
        let line = this.currentLine();
        while (line !== undefined && !line.trim()) {
            this.nextLine();
            line = this.currentLine();
        }
    }
    parseMerge() {
        const { commit, options } = this;
        const correspondence = options.mergeCorrespondence || [];
        const merge = this.currentLine();
        const matches = merge && options.mergePattern
            ? merge.match(options.mergePattern)
            : null;
        if (matches) {
            this.nextLine();
            commit.merge = matches[0] || null;
            assignMatchedCorrespondence(commit, matches, correspondence);
            return true;
        }
        return false;
    }
    parseHeader(isMergeCommit) {
        if (isMergeCommit) {
            this.skipEmptyLines();
        }
        const { commit, options } = this;
        const correspondence = options.headerCorrespondence || [];
        const header = commit.header ?? this.nextLine();
        let matches = null;
        if (header) {
            if (options.breakingHeaderPattern) {
                matches = header.match(options.breakingHeaderPattern);
            }
            if (!matches && options.headerPattern) {
                matches = header.match(options.headerPattern);
            }
        }
        if (header) {
            commit.header = header;
        }
        if (matches) {
            assignMatchedCorrespondence(commit, matches, correspondence);
        }
    }
    parseMeta() {
        const { options, commit } = this;
        if (!options.fieldPattern || !this.isLineAvailable()) {
            return false;
        }
        let matches;
        let field = null;
        let parsed = false;
        while (this.isLineAvailable()) {
            matches = this.currentLine().match(options.fieldPattern);
            if (matches) {
                field = matches[1] || null;
                this.nextLine();
                continue;
            }
            if (field) {
                parsed = true;
                commit[field] = appendLine(commit[field], this.currentLine());
                this.nextLine();
            }
            else {
                break;
            }
        }
        return parsed;
    }
    parseNotes() {
        const { regexes, commit } = this;
        if (!this.isLineAvailable()) {
            return false;
        }
        const matches = this.currentLine().match(regexes.notes);
        let isFooterToken;
        if (matches) {
            const note = {
                title: matches[1],
                text: matches[2]
            };
            commit.notes.push(note);
            commit.footer = appendLine(commit.footer, this.currentLine());
            this.nextLine();
            while (this.isLineAvailable()) {
                if (this.parseMeta()) {
                    return true;
                }
                if (this.parseNotes()) {
                    return true;
                }
                isFooterToken = regexes.footerToken.test(this.currentLine());
                commit.references.push(...this.parseReferences(this.currentLine(), isFooterToken));
                if (!isFooterToken) {
                    note.text = appendLine(note.text, this.currentLine());
                }
                commit.footer = appendLine(commit.footer, this.currentLine());
                this.nextLine();
                if (isFooterToken) {
                    break;
                }
            }
            return true;
        }
        return false;
    }
    parseBodyAndFooter(isBody) {
        const { commit, regexes } = this;
        if (!this.isLineAvailable()) {
            return isBody;
        }
        const isFooterToken = regexes.footerToken.test(this.currentLine());
        const isStillBody = !isFooterToken && isBody;
        commit.references.push(...this.parseReferences(this.currentLine(), isFooterToken));
        if (isStillBody) {
            commit.body = appendLine(commit.body, this.currentLine());
        }
        else {
            commit.footer = appendLine(commit.footer, this.currentLine());
        }
        this.nextLine();
        return isStillBody;
    }
    parseBreakingHeader() {
        const { commit, options } = this;
        if (!options.breakingHeaderPattern || commit.notes.length || !commit.header) {
            return;
        }
        const matches = commit.header.match(options.breakingHeaderPattern);
        if (matches) {
            commit.notes.push({
                title: 'BREAKING CHANGE',
                text: matches[3]
            });
        }
    }
    parseMentions(input) {
        const { commit, regexes } = this;
        let matches;
        for (;;) {
            matches = regexes.mentions.exec(input);
            if (!matches) {
                break;
            }
            commit.mentions.push(matches[1]);
        }
    }
    parseRevert(input) {
        const { commit, options } = this;
        const correspondence = options.revertCorrespondence || [];
        const matches = options.revertPattern
            ? input.match(options.revertPattern)
            : null;
        if (matches) {
            commit.revert = assignMatchedCorrespondence({}, matches, correspondence);
        }
    }
    cleanupCommit() {
        const { commit } = this;
        commit.body &&= trimNewLines(commit.body);
        commit.footer &&= trimNewLines(commit.footer);
        commit.notes.forEach((note) => {
            note.text = trimNewLines(note.text);
        });
        const referencesSet = new Set();
        commit.references = commit.references.filter((reference) => {
            const uid = `${reference.action} ${reference.raw}`.toLocaleLowerCase();
            const ok = !referencesSet.has(uid);
            if (ok) {
                referencesSet.add(uid);
            }
            return ok;
        });
    }
    /**
     * Parse commit message string into an object.
     * @param input - Commit message string.
     * @returns Commit object.
     */
    parse(input) {
        if (!input.trim()) {
            throw new TypeError('Expected a raw commit');
        }
        const { commentChar } = this.options;
        const commentFilter = getCommentFilter(commentChar);
        const rawLines = trimNewLines(input).split(/\r?\n/);
        const lines = commentChar
            ? truncateToScissor(rawLines, commentChar).filter(line => commentFilter(line) && gpgFilter(line))
            : rawLines.filter(line => gpgFilter(line));
        const commit = createCommitObject();
        this.lines = lines;
        this.lineIndex = 0;
        this.commit = commit;
        const isMergeCommit = this.parseMerge();
        this.parseHeader(isMergeCommit);
        if (commit.header) {
            commit.references = this.parseReferences(commit.header);
        }
        let isBody = true;
        while (this.isLineAvailable()) {
            this.parseMeta();
            if (this.parseNotes()) {
                isBody = false;
            }
            if (!this.parseBodyAndFooter(isBody)) {
                isBody = false;
            }
        }
        this.parseBreakingHeader();
        this.parseMentions(input);
        this.parseRevert(input);
        this.cleanupCommit();
        return commit;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWl0UGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NvbW1pdFBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFDN0MsT0FBTyxFQUNMLFlBQVksRUFDWixVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsMkJBQTJCLEVBQzVCLE1BQU0sWUFBWSxDQUFBO0FBQ25CLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFFN0M7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxXQUFXLEdBQW9CLEVBQUU7SUFDbEUsa0pBQWtKO0lBQ2xKLE9BQU87UUFDTCxLQUFLLEVBQUUsSUFBSTtRQUNYLE1BQU0sRUFBRSxJQUFJO1FBQ1osTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLE1BQU0sRUFBRSxJQUFJO1FBQ1osS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsRUFBRTtRQUNaLFVBQVUsRUFBRSxFQUFFO1FBQ2QsR0FBRyxXQUFXO0tBQ2YsQ0FBQTtBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxZQUFZO0lBQ04sT0FBTyxDQUFlO0lBQ3RCLE9BQU8sQ0FBZTtJQUMvQixLQUFLLEdBQWEsRUFBRSxDQUFBO0lBQ3BCLFNBQVMsR0FBRyxDQUFDLENBQUE7SUFDYixNQUFNLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtJQUVyQyxZQUFZLE9BQU8sR0FBa0IsRUFBRTtRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsR0FBRyxjQUFjO1lBQ2pCLEdBQUcsT0FBTztTQUNYLENBQUE7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUMvQyxDQUFDO0lBRU8sV0FBVztRQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ25DLENBQUM7SUFFTyxRQUFRO1FBQ2QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO0lBQ3JDLENBQUM7SUFFTyxlQUFlO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQTtJQUMzQyxDQUFDO0lBRU8sY0FBYyxDQUNwQixLQUFhLEVBQ2IsTUFBcUI7UUFFckIsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQTtRQUV4QixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDNUIsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBRUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFbEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2IsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBRUQsSUFBSSxDQUNGLEdBQUcsRUFDSCxVQUFVLEdBQUcsSUFBSSxFQUNqQixNQUFNLEVBQ04sS0FBSyxDQUNOLEdBQUcsT0FBTyxDQUFBO1FBQ1gsSUFBSSxLQUFLLEdBQWtCLElBQUksQ0FBQTtRQUUvQixJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQ2YsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUUxQyxJQUFJLFVBQVUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN0QixLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUE7Z0JBQ3ZDLFVBQVUsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUMvQyxDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU87WUFDTCxHQUFHO1lBQ0gsTUFBTTtZQUNOLEtBQUs7WUFDTCxVQUFVO1lBQ1YsTUFBTTtZQUNOLEtBQUs7U0FDTixDQUFBO0lBQ0gsQ0FBQztJQUVPLGVBQWUsQ0FDckIsS0FBYSxFQUNiLGFBQWEsR0FBRyxLQUFLO1FBRXJCLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFDeEIsTUFBTSxlQUFlLEdBQUcsYUFBYTtZQUNuQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQjtZQUMxQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQTtRQUN0QixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxDQUFDLENBQUMsZUFBZTtZQUNqQixDQUFDLENBQUMsVUFBVSxDQUFBO1FBQ2QsTUFBTSxVQUFVLEdBQXNCLEVBQUUsQ0FBQTtRQUN4QyxJQUFJLE9BQStCLENBQUE7UUFDbkMsSUFBSSxNQUFxQixDQUFBO1FBQ3pCLElBQUksUUFBZ0IsQ0FBQTtRQUNwQixJQUFJLFNBQWlDLENBQUE7UUFFckMsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNaLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBRTNCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDYixNQUFLO1lBQ1AsQ0FBQztZQUVELE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFBO1lBQzNCLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1lBRTNCLE9BQU8sSUFBSSxFQUFFLENBQUM7Z0JBQ1osU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBO2dCQUVqRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2YsTUFBSztnQkFDUCxDQUFDO2dCQUVELFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDNUIsQ0FBQztRQUNILENBQUM7UUFFRCxPQUFPLFVBQVUsQ0FBQTtJQUNuQixDQUFDO0lBRU8sY0FBYztRQUNwQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFN0IsT0FBTyxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7WUFDMUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO1lBQ2YsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUMzQixDQUFDO0lBQ0gsQ0FBQztJQUVPLFVBQVU7UUFDaEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFDaEMsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixJQUFJLEVBQUUsQ0FBQTtRQUN4RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDaEMsTUFBTSxPQUFPLEdBQUcsS0FBSyxJQUFJLE9BQU8sQ0FBQyxZQUFZO1lBQzNDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7WUFDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUVSLElBQUksT0FBTyxFQUFFLENBQUM7WUFDWixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7WUFFZixNQUFNLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUE7WUFFakMsMkJBQTJCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQTtZQUU1RCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7UUFFRCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFFTyxXQUFXLENBQUMsYUFBc0I7UUFDeEMsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7UUFDdkIsQ0FBQztRQUVELE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFBO1FBQ2hDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsSUFBSSxFQUFFLENBQUE7UUFDekQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDL0MsSUFBSSxPQUFPLEdBQTRCLElBQUksQ0FBQTtRQUUzQyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsSUFBSSxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztnQkFDbEMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUE7WUFDdkQsQ0FBQztZQUVELElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN0QyxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7WUFDL0MsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDeEIsQ0FBQztRQUVELElBQUksT0FBTyxFQUFFLENBQUM7WUFDWiwyQkFBMkIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBQzlELENBQUM7SUFDSCxDQUFDO0lBRU8sU0FBUztRQUNmLE1BQU0sRUFDSixPQUFPLEVBQ1AsTUFBTSxFQUNQLEdBQUcsSUFBSSxDQUFBO1FBRVIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQztZQUNyRCxPQUFPLEtBQUssQ0FBQTtRQUNkLENBQUM7UUFFRCxJQUFJLE9BQWdDLENBQUE7UUFDcEMsSUFBSSxLQUFLLEdBQWtCLElBQUksQ0FBQTtRQUMvQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUE7UUFFbEIsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQztZQUM5QixPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7WUFFeEQsSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDWixLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQTtnQkFDMUIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO2dCQUNmLFNBQVE7WUFDVixDQUFDO1lBRUQsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDVixNQUFNLEdBQUcsSUFBSSxDQUFBO2dCQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO2dCQUM3RCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7WUFDakIsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLE1BQUs7WUFDUCxDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQztJQUVPLFVBQVU7UUFDaEIsTUFBTSxFQUNKLE9BQU8sRUFDUCxNQUFNLEVBQ1AsR0FBRyxJQUFJLENBQUE7UUFFUixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUM7WUFDNUIsT0FBTyxLQUFLLENBQUE7UUFDZCxDQUFDO1FBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdkQsSUFBSSxhQUFzQixDQUFBO1FBRTFCLElBQUksT0FBTyxFQUFFLENBQUM7WUFDWixNQUFNLElBQUksR0FBZTtnQkFDdkIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ2pCLENBQUE7WUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN2QixNQUFNLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO1lBQzdELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUVmLE9BQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUM7Z0JBQzlCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7b0JBQ3JCLE9BQU8sSUFBSSxDQUFBO2dCQUNiLENBQUM7Z0JBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztvQkFDdEIsT0FBTyxJQUFJLENBQUE7Z0JBQ2IsQ0FBQztnQkFFRCxhQUFhLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUE7Z0JBRTVELE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUNwQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUMzRCxDQUFBO2dCQUVELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtnQkFDdkQsQ0FBQztnQkFFRCxNQUFNLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO2dCQUM3RCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7Z0JBRWYsSUFBSSxhQUFhLEVBQUUsQ0FBQztvQkFDbEIsTUFBSztnQkFDUCxDQUFDO1lBQ0gsQ0FBQztZQUVELE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVPLGtCQUFrQixDQUFDLE1BQWU7UUFDeEMsTUFBTSxFQUNKLE1BQU0sRUFDTixPQUFPLEVBQ1IsR0FBRyxJQUFJLENBQUE7UUFFUixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUM7WUFDNUIsT0FBTyxNQUFNLENBQUE7UUFDZixDQUFDO1FBRUQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUE7UUFDbEUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFBO1FBRTVDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUNwQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUMzRCxDQUFBO1FBRUQsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUNoQixNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO1FBQzNELENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtRQUMvRCxDQUFDO1FBRUQsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRWYsT0FBTyxXQUFXLENBQUE7SUFDcEIsQ0FBQztJQUVPLG1CQUFtQjtRQUN6QixNQUFNLEVBQ0osTUFBTSxFQUNOLE9BQU8sRUFDUixHQUFHLElBQUksQ0FBQTtRQUVSLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDNUUsT0FBTTtRQUNSLENBQUM7UUFFRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQTtRQUVsRSxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ1osTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLEtBQUssRUFBRSxpQkFBaUI7Z0JBQ3hCLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ2pCLENBQUMsQ0FBQTtRQUNKLENBQUM7SUFDSCxDQUFDO0lBRU8sYUFBYSxDQUFDLEtBQWE7UUFDakMsTUFBTSxFQUNKLE1BQU0sRUFDTixPQUFPLEVBQ1IsR0FBRyxJQUFJLENBQUE7UUFDUixJQUFJLE9BQStCLENBQUE7UUFFbkMsU0FBUyxDQUFDO1lBQ1IsT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBRXRDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDYixNQUFLO1lBQ1AsQ0FBQztZQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xDLENBQUM7SUFDSCxDQUFDO0lBRU8sV0FBVyxDQUFDLEtBQWE7UUFDL0IsTUFBTSxFQUNKLE1BQU0sRUFDTixPQUFPLEVBQ1IsR0FBRyxJQUFJLENBQUE7UUFDUixNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsb0JBQW9CLElBQUksRUFBRSxDQUFBO1FBQ3pELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhO1lBQ25DLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7WUFDcEMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUVSLElBQUksT0FBTyxFQUFFLENBQUM7WUFDWixNQUFNLENBQUMsTUFBTSxHQUFHLDJCQUEyQixDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUE7UUFDMUUsQ0FBQztJQUNILENBQUM7SUFFTyxhQUFhO1FBQ25CLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFFdkIsTUFBTSxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3pDLE1BQU0sQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUU3QyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNyQyxDQUFDLENBQUMsQ0FBQTtRQUVGLE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUE7UUFFdkMsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ3pELE1BQU0sR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN0RSxNQUFNLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7WUFFbEMsSUFBSSxFQUFFLEVBQUUsQ0FBQztnQkFDUCxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3hCLENBQUM7WUFFRCxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsS0FBYTtRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7WUFDbEIsTUFBTSxJQUFJLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO1FBQzlDLENBQUM7UUFFRCxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQTtRQUNwQyxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuRCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ25ELE1BQU0sS0FBSyxHQUFHLFdBQVc7WUFDdkIsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pHLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDNUMsTUFBTSxNQUFNLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtRQUVuQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQTtRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUVwQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7UUFFdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUUvQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3pELENBQUM7UUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7UUFFakIsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7WUFFaEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztnQkFDdEIsTUFBTSxHQUFHLEtBQUssQ0FBQTtZQUNoQixDQUFDO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUNyQyxNQUFNLEdBQUcsS0FBSyxDQUFBO1lBQ2hCLENBQUM7UUFDSCxDQUFDO1FBRUQsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUE7UUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUVwQixPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7Q0FDRiJ9
// EXTERNAL MODULE: external "stream"
var external_stream_ = __webpack_require__(2203);
;// CONCATENATED MODULE: ./node_modules/conventional-commits-parser/dist/stream.js


/**
 * Create async generator function to parse async iterable of raw commits.
 * @param options - CommitParser options.
 * @returns Async generator function to parse async iterable of raw commits.
 */
function parseCommits(options = {}) {
    const warnOption = options.warn;
    const warn = warnOption === true
        ? (err) => {
            throw err;
        }
        : warnOption
            ? (err) => warnOption(err.toString())
            : () => { };
    return async function* parse(rawCommits) {
        const parser = new CommitParser(options);
        let rawCommit;
        for await (rawCommit of rawCommits) {
            try {
                yield parser.parse(rawCommit.toString());
            }
            catch (err) {
                warn(err);
            }
        }
    };
}
/**
 * Create stream to parse commits.
 * @param options - CommitParser options.
 * @returns Stream of parsed commits.
 */
function parseCommitsStream(options = {}) {
    return external_stream_.Transform.from(parseCommits(options));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sUUFBUSxDQUFBO0FBRWxDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVoRDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FDMUIsT0FBTyxHQUF3QixFQUFFO0lBRWpDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7SUFDL0IsTUFBTSxJQUFJLEdBQUcsVUFBVSxLQUFLLElBQUk7UUFDOUIsQ0FBQyxDQUFDLENBQUMsR0FBVSxFQUFFLEVBQUU7WUFDZixNQUFNLEdBQUcsQ0FBQTtRQUNYLENBQUM7UUFDRCxDQUFDLENBQUMsVUFBVTtZQUNWLENBQUMsQ0FBQyxDQUFDLEdBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM1QyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQWMsQ0FBQyxDQUFBO0lBRTFCLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQzFCLFVBQXNFO1FBRXRFLE1BQU0sTUFBTSxHQUFHLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3hDLElBQUksU0FBMEIsQ0FBQTtRQUU5QixJQUFJLEtBQUssRUFBRSxTQUFTLElBQUksVUFBVSxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDO2dCQUNILE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUMxQyxDQUFDO1lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDYixJQUFJLENBQUMsR0FBWSxDQUFDLENBQUE7WUFDcEIsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDLENBQUE7QUFDSCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxPQUFPLEdBQXdCLEVBQUU7SUFDbEUsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQzlDLENBQUMifQ==
;// CONCATENATED MODULE: ./node_modules/conventional-commits-parser/dist/index.js


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsY0FBYyxtQkFBbUIsQ0FBQTtBQUNqQyxjQUFjLGFBQWEsQ0FBQSJ9

/***/ })

};
