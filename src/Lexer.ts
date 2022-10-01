import { NodePosition } from "./Nodes";

enum TOKEN_TYPE {
    STRING,
    NUMBER,
    LPAREN,
    RPAREN,
    SEMI,
    IDENTIFIER
}

class Token {
    public constructor(public type: TOKEN_TYPE, public value: string) {}
}

const LETTERS = /[^a-z_0-9]/i;
const SYNTAX = "[];$\\";
const OPS = "!=><";

class Lexer {
    public pos: NodePosition;
    public escape_c = false;
    public constructor(public input: string) {}

    public main() {
        this.pos = new NodePosition(0,0,0);
        this.escape_c = false;
        let tokens: Token[] = [];
        while (!this.eof()) {
            let token = this.process();
            if (token) {
                if (Array.isArray(token)) {
                    tokens.push(...token);
                } else tokens.push(token);
            };
        }
        return tokens;
    };
    public next() {
        let current = this.input[this.pos.idx++];
        if (this.peek() === "\n") {this.pos.p = 0;this.pos.ln++}
        else this.pos.p++;
        return current;
    }
    public peek(offset: number = 0) {
        return this.input[this.pos.idx + offset]
    }
    public eof() {
        return !this.peek();
    }
    public process() {
        let char = this.peek();
        let x = "";
        if (this.escape_c) {
            if (SYNTAX.indexOf(char) > -1) {
                if (SYNTAX.indexOf(this.peek(1)) > -1) {
                    this.next();
                    this.escape_c = false;
                    return new Token(TOKEN_TYPE.STRING, char);
                } else {
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
            case "[": this.next(); return new Token(TOKEN_TYPE.LPAREN, char);
            case "]": this.next(); return new Token(TOKEN_TYPE.RPAREN, char);
            case ";": this.next(); return new Token(TOKEN_TYPE.SEMI, char);
            case "$": return this.make_id();
            case "\\": this.next(); this.escape_c = true; return null;
        }

        if (this.eof()) {
            if (x) return new Token(TOKEN_TYPE.STRING, x);
        } else {
            let str = x + this.make_str();
            let arr: (string | number)[] = str.match(/\w+|\W+|\d+/g)
            let arrt: Token[] = [];
            while (arr.length > 0) {
                let p = arr.shift() as any;
                if (/\s/.test(p)) arrt.push(new Token(TOKEN_TYPE.STRING, p))
                else
                arrt.push(new Token(TOKEN_TYPE[isNaN(p) ? "STRING" : "NUMBER"], p))
            }
            return arrt;
        }
    }
    public splitter(break_fn: (c: string) => boolean) {
        let x = "";
        while (true) {
            if (this.eof()) break;
            if (break_fn(this.peek()) && !this.escape_c) {
                if (this.peek() === "\\") {
                    this.escape_c = true;
                    this.next();
                    continue;
                }
                 else break;
            }
            if (this.escape_c) this.escape_c = false;
            x += this.peek();
            this.next();
        }
        return x;
    }
    public make_id() {
        const expr = (c: string) => (LETTERS.test(c));
        this.next();
        const id = this.splitter(expr);
        return new Token(TOKEN_TYPE.IDENTIFIER, id);
    }
    public make_str() {
        const expr = (c: string) => (SYNTAX.indexOf(c) > -1);
        const str = this.splitter(expr);
        return str;
    }
}

export {
    Lexer,
    Token,
    TOKEN_TYPE,
    LETTERS
}