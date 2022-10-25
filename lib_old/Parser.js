"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const Lexer_1 = require("./Lexer");
const Nodes_1 = require("./Nodes");
class Parser {
    constructor(_tokens) {
        this._tokens = _tokens;
        this.tokens = [];
    }
    main() {
        this.tokens = this._tokens.concat();
        let node = new Nodes_1.NodeProgram("<module>");
        while (this.tokens.length > 0) {
            node._addChild(this._parseAtom());
        }
        return node;
    }
    _parseAtom() {
        let token = this.tokens.shift();
        switch (token.type) {
            case Lexer_1.TOKEN_TYPE.STRING: return new Nodes_1.NodeString(token.value);
            case Lexer_1.TOKEN_TYPE.NUMBER: return new Nodes_1.NodeNumber(token.value);
            case Lexer_1.TOKEN_TYPE.IDENTIFIER: return this._parseIdentifier(token);
        }
        // Unknown Token
        throw new Error("Unexpected syntax of '" + token.value + "'");
    }
    _parseIdentifier(token) {
        if (!token.value)
            throw new Error(`${Lexer_1.TOKEN_TYPE[token.type]}_TOKEN found, but it does not have a name!`);
        const node = new Nodes_1.NodeIdentifier(token.value);
        // Parse argument if next is LPAREN
        if (this.tokens[0]?.type === Lexer_1.TOKEN_TYPE.LPAREN) {
            this.tokens.shift();
            let childs = this._parseParen();
            while (childs.length > 0) {
                node._addChild(this._makeArgument(childs));
            }
        }
        return node;
    }
    _parseParen() {
        let tokens = [];
        let end = false;
        while (this.tokens.length > 0) {
            if (this.tokens[0].type === Lexer_1.TOKEN_TYPE.RPAREN) {
                end = true;
                this.tokens.shift();
                break;
            }
            if (this.tokens[0].type === Lexer_1.TOKEN_TYPE.SEMI)
                tokens.push(this.tokens.shift());
            else
                tokens.push(this._parseAtom());
        }
        if (!end)
            throw new Error(`Expected to find ${Lexer_1.TOKEN_TYPE[3]}_TOKEN, instead not found!`);
        return tokens;
    }
    _makeArgument(tokens) {
        const argument = new Nodes_1.NodeArgument();
        while (tokens.length > 0) {
            const node = tokens.shift();
            if (node instanceof Lexer_1.Token)
                break;
            argument._addChild(node);
        }
        return argument;
    }
}
exports.Parser = Parser;
