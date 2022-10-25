import { Token } from "./Lexer";
import { NodeArgument, NodeIdentifier, NodeNumber, NodeProgram, NodeString, NodeToken } from "./Nodes";
declare class Parser {
    private _tokens;
    tokens: Token[];
    constructor(_tokens: Token[]);
    main(): NodeProgram;
    _parseAtom(): NodeString | NodeNumber | NodeIdentifier;
    _parseIdentifier(token: Token): NodeIdentifier;
    _parseParen(): (NodeToken | Token)[];
    _makeArgument(tokens: (NodeToken | Token)[]): NodeArgument;
}
export { Parser };
