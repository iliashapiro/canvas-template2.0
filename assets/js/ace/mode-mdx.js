define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var DocCommentHighlightRules = function() {
    this.$rules = {
        "start" : [ {
            token : "comment.doc.tag",
            regex : "@[\\w\\d_]+" // TODO: fix email addresses
        }, 
        DocCommentHighlightRules.getTagRule(),
        {
            defaultToken : "comment.doc",
            caseInsensitive: true
        }]
    };
};

oop.inherits(DocCommentHighlightRules, TextHighlightRules);

DocCommentHighlightRules.getTagRule = function(start) {
    return {
        token : "comment.doc.tag.storage.type",
        regex : "\\b(?:TODO|FIXME|XXX|HACK)\\b"
    };
};

DocCommentHighlightRules.getStartRule = function(start) {
    return {
        token : "comment.doc", // doc comment
        regex : "\\/\\*(?=\\*)",
        next  : start
    };
};

DocCommentHighlightRules.getEndRule = function (start) {
    return {
        token : "comment.doc", // closing comment
        regex : "\\*\\/",
        next  : start
    };
};


exports.DocCommentHighlightRules = DocCommentHighlightRules;

});

define("ace/mode/mdx_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MDXHighlightRules = function() {
    var logicalOperators = "IS|AS|DISTINCT|:|^|/|*|+|-|EXISTING|<>|>=|=|<=|>|<|NOT|AND|XOR|OR";
    var builtinFunctions = (
        "ABS|GENERATIONS|MIN|AGGREGATE|GETFIRSTDATE|MOD|ANCESTOR|GETFIRSTDAY|NEXTMEMBER|ANCESTORS|GETLASTDATE|NONEMPTYCOUNT|ATTRIBUTE|GETLASTDAY|NONEMPTYSUBSET|ATTRIBUTEEX|GETNEXTDAY|NTILE|AVG|GETROUNDDATE|NUMTOSTR|BOTTOMCOUNT|HEAD|OPENINGPERIOD|BOTTOMPERCENT|HIERARCHIZE|ORDER|BOTTOMSUM|IIF|ORDINAL|CASE|INSTR|PARALLELPERIOD|CELLVALUE|INSTRING|PARENT|CHILDREN|INT|PERCENTILE|CLOSINGPERIOD|INTERSECT|PERIODSTODATE|COALESCEEMPTY|IS|POWER|CONCAT|ISACCTYPE|PREVMEMBER|CONTAINS|ISANCESTOR|RANK|COUNT|ISCHILD|REALVALUE|COUSIN|ISEMPTY|RELMEMBERRANGE|CROSSJOIN|ISGENERATION|REMAINDER|CURRENTAXISMEMBER|ISLEAF|RIGHT|CURRENTMEMBER|ISLEVEL|ROUND|CURRENTTUPLE|ISMATCH|RTRIM|DATEDIFF|ISSIBLING|SIBLINGS|DATEPART|ISUDA|STDDEV|DATEROLL|ISVALID|STDDEVP|DATETOMEMBER|ITEM|STRTOMBR|DEFAULTMEMBER|JULIANDATE|STRTONUM|DESCENDANTS|LAG|SUBSET|DISTINCT|LASTCHILD|SUBSTRING|DIMENSION|LASTPERIODS|SUM|DRILLDOWNBYLAYER|LASTSIBLING|TAIL|DRILLDOWNMEMBER|LEAD|TODATE|DRILLUPBYLAYER|LEAVES|TODATEEX|DRILLUPMEMBER|LEFT|TODAY|DTS|LEN|TOPCOUNT|ENUMTEXT|LEVEL|TOPPERCENT|ENUMVALUE|LEVELS|TOPSUM|EXCEPT|LINKMEMBER|TRUNCATE|EXP|LN|TUPLERANGE|EXTRACT|LOG|UDA|FACTORIAL|LOG10|UNION|FILTER|LOWER|UNIXDATE|FIRSTCHILD|LTRIM|UPPER|FIRSTSIBLING|MAX|VALUE|FORMATDATE|MEDIAN|WITHATTR|GENERATE|MEMBERRANGE|WITHATTREX|GENERATION|MEMBERS|XTD|TM1FILTERBYPATTERN|TM1FILTERBYLEVEL|TM1DRILLDOWNMEMBER|TM1MEMBER|TM1SORT|TM1SORTBYINDEX|TM1SUBSETALL|TM1SUBSETTOSET|TM1TUPLESIZE"
    );
    var keywords = "ABSOLUTE|DESC|LEAVES|SELF_BEFORE_AFTER|ACTIONPARAMETERSET|DESCENDANTS|LEVEL|SESSION|ADDCALCULATEDMEMBERS|DESCRIPTION|LEVELS|SET|AFTER|DIMENSION|LINKMEMBER|SETTOARRAY|AGGREGATE|DIMENSIONS|LINREGINTERCEPT|SETTOSTR|ALL|DISTINCT|LINREGPOINT|SORT|ALLMEMBERS|DISTINCTCOUNT|LINREGR2|STDDEV|ANCESTOR|DRILLDOWNLEVEL|LINREGSLOPE|STDDEVP|ANCESTORS|DRILLDOWNLEVELBOTTOM|LINREGVARIANCE|STDEV|AND|DRILLDOWNLEVELTOP|LOOKUPCUBE|STDEVP|AS|DRILLDOWNMEMBER|MAX|STORAGE|ASC|DRILLDOWNMEMBERBOTTOM|MEASURE|STRIPCALCULATEDMEMBERS|ASCENDANTS|DRILLDOWNMEMBERTOP|MEDIAN|STRTOMEMBER|AVERAGE|DRILLUPLEVEL|MEMBER|STRTOSET|AXIS|DRILLUPMEMBER|MEMBERS|STRTOTUPLE|BASC|DROP|MEMBERTOSTR|STRTOVAL|BDESC|EMPTY|MIN|STRTOVALUE|BEFORE|END|MTD|SUBSET|BEFORE_AND_AFTER|ERROR|NAME|SUM|BOTTOMCOUNT|EXCEPT|NAMETOSET|TAIL|BOTTOMPERCENT|EXCLUDEEMPTY|NEST|THIS|BOTTOMSUM|EXTRACT|NEXTMEMBER|TOGGLEDRILLSTATE|BY|FALSE|NO_ALLOCATION|TOPCOUNT|CACHE|FILTER|NO_PROPERTIES|TOPPERCENT|CALCULATE|FIRSTCHILD|NON|TOPSUM|CALCULATION|FIRSTSIBLING|NONEMPTYCROSSJOIN|TOTALS|CALCULATIONCURRENTPASS|FOR|NOT_RELATED_TO_FACTS|TREE|CALCULATIONPASSVALUE|FREEZE|NULL|TRUE|CALCULATIONS|FROM|ON|TUPLETOSTR|CALL|GENERATE|OPENINGPERIOD|TYPE|CELL|GLOBAL|OR|UNION|CELLFORMULASETLIST|GROUP|PAGES|UNIQUE|CHAPTERS|GROUPING|PARALLELPERIOD|UNIQUENAME|CHILDREN|HEAD|PARENT|UPDATE|CLEAR|HIDDEN|PASS|USE|CLOSINGPERIOD|HIERARCHIZE|PERIODSTODATE|USE_EQUAL_ALLOCATION|COALESCEEMPTY|HIERARCHY|POST|USE_WEIGHTED_ALLOCATION|COLUMN|IGNORE|PREDICT|USE_WEIGHTED_INCREMENT|COLUMNS|IIF|PREVMEMBER|USERNAME|CORRELATION|INCLUDEEMPTY|PROPERTIES|VALIDMEASURE|COUNT|INDEX|PROPERTY|VALUE|COUSIN|INTERSECT|QTD|VAR|COVARIANCE|IS|RANK|VARIANCE|COVARIANCEN|ISANCESTOR|RECURSIVE|VARIANCEP|CREATE|ISEMPTY|RELATIVE|VARP|CREATEPROPERTYSET|ISGENERATION|ROLLUPCHILDREN|VISUAL|CREATEVIRTUALDIMENSION|ISLEAF|ROOT|VISUALTOTALS|CROSSJOIN|ISSIBLING|ROWS|WHERE|CUBE|ITEM|SCOPE|WITH|CURRENT|LAG|SECTIONS|WTD|CURRENTCUBE|LASTCHILD|SELECT|XOR|CURRENTMEMBER|LASTPERIODS|SELF|YTD|DEFAULT_MEMBER|LASTSIBLING|SELF_AND_AFTER|DEFAULTMEMBER|LEAD|SELF_AND_BEFORE"
    keywords = keywords.split('|');
    keywords = keywords.filter(function(value, index, self) {
        return logicalOperators.split('|').indexOf(value) === -1 && builtinFunctions.split('|').indexOf(value) === -1;
    });
    keywords = keywords.sort().join('|');
    
    
    var keywordMapper = this.createKeywordMapper({
        "constant.language": logicalOperators,
        "support.function": builtinFunctions,
        "keyword": keywords
    }, "identifier", true);
    var setStatements = "SET ANSI_DEFAULTS|SET ANSI_NULLS|SET ANSI_NULL_DFLT_OFF|SET ANSI_NULL_DFLT_ON|SET ANSI_PADDING|SET ANSI_WARNINGS|SET ARITHABORT|SET ARITHIGNORE|SET CONCAT_NULL_YIELDS_NULL|SET CURSOR_CLOSE_ON_COMMIT|SET DATEFIRST|SET DATEFORMAT|SET DEADLOCK_PRIORITY|SET FIPS_FLAGGER|SET FMTONLY|SET FORCEPLAN|SET IDENTITY_INSERT|SET IMPLICIT_TRANSACTIONS|SET LANGUAGE|SET LOCK_TIMEOUT|SET NOCOUNT|SET NOEXEC|SET NUMERIC_ROUNDABORT|SET OFFSETS|SET PARSEONLY|SET QUERY_GOVERNOR_COST_LIMIT|SET QUOTED_IDENTIFIER|SET REMOTE_PROC_TRANSACTIONS|SET ROWCOUNT|SET SHOWPLAN_ALL|SET SHOWPLAN_TEXT|SET SHOWPLAN_XML|SET STATISTICS IO|SET STATISTICS PROFILE|SET STATISTICS TIME|SET STATISTICS XML|SET TEXTSIZE|SET XACT_ABORT".split('|');
    var isolationLevels = "READ UNCOMMITTED|READ COMMITTED|REPEATABLE READ|SNAPSHOP|SERIALIZABLE".split('|');
    for (var i = 0; i < isolationLevels.length; i++) {
        setStatements.push('SET TRANSACTION ISOLATION LEVEL ' + isolationLevels[i]);
    }
    
    
    this.$rules = {
        start: [{
            token: "string.start",
            regex: "'",
            next: [{
                token: "constant.language.escape",
                regex: /''/
            }, {
                token: "string.end",
                next: "start",
                regex: "'"
            }, {
                defaultToken: "string"
            }]
        },
        DocCommentHighlightRules.getStartRule("doc-start"), {
            token: "comment",
            regex: "--.*$"
        }, {
            token: "comment",
            start: "/\\*",
            end: "\\*/"
        }, {
            token: "constant.numeric", // float
            regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token: keywordMapper,
            regex: "@{0,2}[a-zA-Z_$][a-zA-Z0-9_$]*\\b(?!])" //up to 2 @symbols for some built in functions
        }, {
            token: "constant.class",
            regex: "@@?[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token: "keyword.operator",
            regex: "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|=|\\*"
        }, {
            token: "paren.lparen",
            regex: "[\\(]"
        }, {
            token: "paren.rparen",
            regex: "[\\)]"
        }, {
            token: "punctuation",
            regex: ",|;"
        }, {
            token: "text",
            regex: "\\s+"
        }],
        comment: [
        DocCommentHighlightRules.getTagRule(), {
            token: "comment",
            regex: "\\*\\/",
            next: "no_regex"
        }, {
            defaultToken: "comment",
            caseInsensitive: true
        }]
    };
    for (var i = 0; i < setStatements.length; i++) {
        this.$rules.start.unshift({
            token: "set.statement",
            regex: setStatements[i]
        });
    }
    
    this.embedRules(DocCommentHighlightRules, "doc-", [DocCommentHighlightRules.getEndRule("start")]);
    this.normalizeRules();
    var completions = [];
    var addCompletions = function(arr, meta) {
        arr.forEach(function(v) {
            completions.push({
                name: v,
                value: v,
                score: 0,
                meta: meta
            });
        });
    };
    addCompletions(logicalOperators.split('|'), 'operator');
    addCompletions(builtinFunctions.split('|'), 'function');
    addCompletions(setStatements, 'statement');
    addCompletions(keywords.split('|'), 'keyword');
    
    this.completions = completions;
};

oop.inherits(MDXHighlightRules, TextHighlightRules);

exports.MDXHighlightRules = MDXHighlightRules;
});

define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
    
    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
    
        if (this.singleLineBlockCommentRe.test(line)) {
            if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                return "";
        }
    
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
    
        if (!fw && this.startRegionRe.test(line))
            return "start"; // lineCommentRegionStart
    
        return fw;
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        
        if (this.startRegionRe.test(line))
            return this.getCommentRegionBlock(session, line, row);
        
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
                
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                } else if (foldStyle != "all")
                    range = null;
            }
            
            return range;
        }

        if (foldStyle === "markbegin")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };
    
    this.getSectionRange = function(session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if  (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                } else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                } else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function(session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[1]) depth--;
            else depth++;

            if (!depth) break;
        }

        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };

}).call(FoldMode.prototype);

});

define("ace/mode/folding/mdx",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./cstyle").FoldMode;

var FoldMode = exports.FoldMode = function() {};

oop.inherits(FoldMode, BaseFoldMode);

(function() {
    
    this.foldingStartMarker = /(\bCASE\b|\bBEGIN\b)|^\s*(\/\*)/i;
    this.startRegionRe = /^\s*(\/\*|--)#?region\b/;
    
    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
    
        if (this.startRegionRe.test(line)) return this.getCommentRegionBlock(session, line, row);
    
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;
            if (match[1]) return this.getBeginEndBlock(session, row, i, match[1]);
    
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                }
                else if (foldStyle != "all") range = null;
            }
    
            return range;
        }
    
        if (foldStyle === "markbegin") return;
        return;
    };
    this.getBeginEndBlock = function(session, row, column, matchSequence) {
        var start = {
            row: row,
            column: column + matchSequence.length
        };
        var maxRow = session.getLength();
        var line;
    
        var depth = 1;
        var re = /(\bCASE\b|\bBEGIN\b)|(\bEND\b)/i;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[1]) depth++;
            else depth--;
    
            if (!depth) break;
        }
        var endRow = row;
        if (endRow > start.row) {
            return new Range(start.row, start.column, endRow, line.length);
        }
    };

}).call(FoldMode.prototype);

});

define("ace/mode/mdx",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/mdx_highlight_rules","ace/mode/folding/mdx"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var MDXHighlightRules = require("./mdx_highlight_rules").MDXHighlightRules;
var MDXFoldMode = require("./folding/mdx").FoldMode;

var Mode = function() {
    this.HighlightRules = MDXHighlightRules;
    this.foldingRules = new MDXFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "--";
    this.blockComment = {start: "/*", end: "*/"};
    this.getCompletions = function(state, session, pos, prefix) {
        return session.$mode.$highlightRules.completions;
    };
    
    this.$id = "ace/mode/mdx";
}).call(Mode.prototype);

exports.Mode = Mode;

});
