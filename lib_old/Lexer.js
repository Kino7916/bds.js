"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LETTERS = exports.TOKEN_TYPE = exports.Token = exports.Lexer = void 0;
const Nodes_1 = require("./Nodes");
var TOKEN_TYPE;
(function (TOKEN_TYPE) {
    TOKEN_TYPE[TOKEN_TYPE["STRING"] = 0] = "STRING";
    TOKEN_TYPE[TOKEN_TYPE["NUMBER"] = 1] = "NUMBER";
    TOKEN_TYPE[TOKEN_TYPE["LPAREN"] = 2] = "LPAREN";
    TOKEN_TYPE[TOKEN_TYPE["RPAREN"] = 3] = "RPAREN";
    TOKEN_TYPE[TOKEN_TYPE["SEMI"] = 4] = "SEMI";
    TOKEN_TYPE[TOKEN_TYPE["IDENTIFIER"] = 5] = "IDENTIFIER";
})(TOKEN_TYPE || (TOKEN_TYPE = {}));
exports.TOKEN_TYPE = TOKEN_TYPE;
class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
exports.Token = Token;
const LETTERS = /[^a-z_0-9]/i;
exports.LETTERS = LETTERS;
const SYNTAX = "[];$\\";
const OPS = "!=><";
class Lexer {
    constructor(input) {
        this.input = input;
        this.escape_c = false;
    }
    main() {
        this.pos = new Nodes_1.NodePosition(0, 0, 0);
        this.escape_c = false;
        let tokens = [];
        while (!this.eof()) {
            let token = this.process();
            if (token) {
                if (Array.isArray(token)) {
                    tokens.push(...token);
                }
                else
                    tokens.push(token);
            }
            ;
        }
        return tokens;
    }
    ;
    next() {
        let current = this.input[this.pos.idx++];
        if (this.peek() === "\n") {
            this.pos.p = 0;
            this.pos.ln++;
        }
        else
            this.pos.p++;
        return current;
    }
    peek(offset = 0) {
        return this.input[this.pos.idx + offset];
    }
    eof() {
        return !this.peek();
    }
    process() {
        let char = this.peek();
        let x = "";
        if (this.escape_c) {
            if (SYNTAX.indexOf(char) > -1) {
                if (SYNTAX.indexOf(this.peek(1)) > -1) {
                    this.next();
                    this.escape_c = false;
                    return new Token(TOKEN_TYPE.STRING, char);
                }
                else {
                    x += this.next();
                }
            }
            else {
                x += "\\" + this.next();
            }
            char = this.peek();
            this.escape_c = false;
        }
        switch (char) {
            case "[":
                this.next();
                return new Token(TOKEN_TYPE.LPAREN, char);
            case "]":
                this.next();
                return new Token(TOKEN_TYPE.RPAREN, char);
            case ";":
                this.next();
                return new Token(TOKEN_TYPE.SEMI, char);
            case "$": return this.make_id();
            case "\\":
                this.next();
                this.escape_c = true;
                return null;
        }
        if (this.eof()) {
            if (x)
                return new Token(TOKEN_TYPE.STRING, x);
        }
        else {
            let str = x + this.make_str();
            let arr = str.match(/\w+|\W+|\d+/g);
            let arrt = [];
            while (arr.length > 0) {
                let p = arr.shift();
                if (/\s/.test(p))
                    arrt.push(new Token(TOKEN_TYPE.STRING, p));
                else
                    arrt.push(new Token(TOKEN_TYPE[isNaN(p) ? "STRING" : "NUMBER"], p));
            }
            return arrt;
        }
    }
    splitter(break_fn) {
        let x = "";
        while (true) {
            if (this.eof())
                break;
            if (break_fn(this.peek()) && !this.escape_c) {
                if (this.peek() === "\\") {
                    this.escape_c = true;
                    this.next();
                    continue;
                }
                else
                    break;
            }
            if (this.escape_c)
                this.escape_c = false;
            x += this.peek();
            this.next();
        }
        return x;
    }
    make_id() {
        const expr = (c) => (LETTERS.test(c));
        this.next();
        const id = this.splitter(expr);
        return new Token(TOKEN_TYPE.IDENTIFIER, id);
    }
    make_str() {
        const expr = (c) => (SYNTAX.indexOf(c) > -1);
        const str = this.splitter(expr);
        return str;
    }
}
exports.Lexer = Lexer;
