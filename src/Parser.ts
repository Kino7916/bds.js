import { Token, TOKEN_TYPE } from "./Lexer";
import { NodeArgument, NodeIdentifier, NodeNumber, NodeProgram, NodeString, NodeToken } from "./Nodes";

class Parser {
    tokens: Token[] = [];
    public constructor(private _tokens: Token[]) {}

    public main() {
        this.tokens = this._tokens.concat();
        let node = new NodeProgram("<module>");
        while (this.tokens.length > 0) {
            node._addChild(this._parseAtom());
        }
        return node;
    }
    public _parseAtom() {
        let token = this.tokens.shift();
        switch (token.type as number) {
            case TOKEN_TYPE.STRING: return new NodeString(token.value);
            case TOKEN_TYPE.NUMBER: return new NodeNumber(token.value);
            case TOKEN_TYPE.IDENTIFIER: return this._parseIdentifier(token);
        }

        // Unknown Token
        throw new Error("Unexpected syntax of '" + token.value + "'")
    }
    public _parseIdentifier(token: Token) {
        if (!token.value) throw new Error(`${TOKEN_TYPE[token.type]}_TOKEN found, but it does not have a name!`);
        const node = new NodeIdentifier(token.value);

        // Parse argument if next is LPAREN
        if (this.tokens[0]?.type === TOKEN_TYPE.LPAREN) {
            this.tokens.shift();
            let childs = this._parseParen();
            while (childs.length > 0) {
                node._addChild(this._makeArgument(childs));
            }
        }
        return node;
    }
    public _parseParen() {
        let tokens: (NodeToken | Token)[] = [];
        let end = false;
        while (this.tokens.length > 0) {
            if (this.tokens[0].type === TOKEN_TYPE.RPAREN) {
                end = true;
                this.tokens.shift()
                break;
            }

            if (this.tokens[0].type === TOKEN_TYPE.SEMI)
                tokens.push(this.tokens.shift())
            else
                tokens.push(this._parseAtom());
        }
        if (!end) throw new Error(`Expected to find ${TOKEN_TYPE[3]}_TOKEN, instead not found!`);
        return tokens;
    }

    public _makeArgument(tokens: (NodeToken | Token)[]) {
        const argument = new NodeArgument();
        while (tokens.length > 0) {
            const node = tokens.shift();
            if (node instanceof Token) break;
            argument._addChild(node);
        }
        return argument;
    }
}

export {
    Parser
}