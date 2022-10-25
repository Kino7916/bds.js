import { Token, TokenProgram } from "./Lexer";

class Parser {
    tokens: Token[];
    private busy: boolean;
    public constructor() {}
    
    public get isBusy() {return this.busy};
    parseToAst(tokens: Token[]): TokenProgram {
        if (this.busy) throw new Error("Parser is busy!");
        this.tokens = tokens;
        this.busy = true;
        let arr = [];
        
        while (this.tokens.length > 0) {
            arr.push(this.parseAtom());
        }
        return {type: "program", child: arr}
    }
    peek(offset = 0) {
        return this.tokens[offset]
    }
    shift() {
        return this.tokens.shift();
    }
    eof() {
        return !(this.tokens.length > 0);
    }
    last(arr: any[]) {
        return arr[arr.length -1]
    }
    readArgument() {
        let arr = [];
        let end = false;
        let arg = {type: "argument", child: []}
        this.shift();
        while (!this.eof()) {
            if (this.peek()?.type === "close") {
                end = true;
                this.shift();
                console.log("found end")
                break;
            }
            if (this.peek()?.type === "newArg") {
                arr.push(arg);
                arg = {type: "argument", child: []};
                this.shift();
                continue;
            }
            arg.child.push(this.parseAtom());
        }

        if (end === false) throw new Error(``)
        return arr;
    }
    parseParen(): Token[] {
        return this.readArgument();
    };
    parseAtom() {
        let token = this.shift();
        if (token.type === "string") return token;
        if (token.type === "number") return token;
        if (token.type === "operator") return token;
        if (token.type === "call") {
            if (this.peek().type === "open") token.child = this.parseParen();
            return token;
        }
        throw new Error(`Unexpected token of ${token.type} at ${token.pos}:${token.line}`)
    };
}

export { Parser };