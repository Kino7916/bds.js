import { Token, TOKEN_TYPE } from "./Lexer";
import { NodeArgument, NodeIdentifier, NodeNumber, NodeProgram, NodeString, NodeToken } from "./Nodes";

class Parser {
    tokens: Token[] = [];
    public constructor(private _tokens: Token[]) {}

    public main() {
        this.tokens = this._tokens.concat();
        let node = new NodeProgram("<module>");
        while (this.tokens.length > 0) {
            node.add_child(this.parse_atom());
        }
        return node;
    }
    public parse_atom() {
        let token = this.tokens.shift();
        switch (token.type as number) {
            case TOKEN_TYPE.STRING: return new NodeString(token.value);
            case TOKEN_TYPE.NUMBER: return new NodeNumber(token.value);
            case TOKEN_TYPE.IDENTIFIER: return this.parse_identifier(token);
        }

        // Unknown Token
        throw new Error("Unexpected syntax of '" + token.value + "'")
    }
    public parse_identifier(token: Token) {
        if (!token.value) throw new Error(`${TOKEN_TYPE[token.type]}_TOKEN found, but it does not have a name!`);
        const node = new NodeIdentifier(token.value);

        // Parse argument if next is LPAREN
        if (this.tokens[0]?.type === TOKEN_TYPE.LPAREN) {
            this.tokens.shift();
            let childs = this.parse_paren();
            while (childs.length > 0) {
                node.add_child(this.make_argument(childs));
            }
        }
        return node;
    }
    public parse_paren() {
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
                tokens.push(this.parse_atom());
        }
        if (!end) throw new Error(`Expected to find ${TOKEN_TYPE[3]}_TOKEN, instead not found!`);
        return tokens;
    }

    public make_argument(tokens: (NodeToken | Token)[]) {
        const argument = new NodeArgument();
        while (tokens.length > 0) {
            const node = tokens.shift();
            if (node instanceof Token) break;
            argument.add_child(node);
        }
        return argument;
    }
}

export {
    Parser
}