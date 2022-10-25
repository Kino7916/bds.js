import { NodePosition } from "./Nodes";
declare enum TOKEN_TYPE {
    STRING = 0,
    NUMBER = 1,
    LPAREN = 2,
    RPAREN = 3,
    SEMI = 4,
    IDENTIFIER = 5
}
declare class Token {
    type: TOKEN_TYPE;
    value: string;
    constructor(type: TOKEN_TYPE, value: string);
}
declare const LETTERS: RegExp;
declare class Lexer {
    input: string;
    pos: NodePosition;
    escape_c: boolean;
    constructor(input: string);
    main(): Token[];
    next(): string;
    peek(offset?: number): string;
    eof(): boolean;
    process(): Token | Token[];
    splitter(break_fn: (c: string) => boolean): string;
    make_id(): Token;
    make_str(): string;
}
export { Lexer, Token, TOKEN_TYPE, LETTERS };
