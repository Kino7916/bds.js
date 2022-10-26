import path from "path";
import { Context } from "./Context";
import { Environment } from "./Environment";
import { Evaluator } from "./Evaluator";
import { Lexer, TokenArgument, TokenOperator } from "./Lexer";
import { Parser } from "./Parser";
import { RuntimeBag } from "./RuntimeBag";

interface RuntimeOptions {
  alwaysStrict: boolean;
  trimOutput: boolean;
}

class Runtime {
  public global = new Environment();
  private contexts = new Map<string, Context>();
  private evaluator = Evaluator.singleton;
  public options: RuntimeOptions = {
    alwaysStrict: false,
    trimOutput: true
  };
  public constructor() {
    this._prepareGlobal();
  }

  public runInput(fileName: string, input: string) {
    const ast = new Parser().parseToAst(
      /* Tokens */ new Lexer(input).main(),
      this
    );
    const ctx = this.prepareContext(fileName);
    return this.evaluator.evaluate(ast, ctx);
  }

  public prepareContext(fileName: string) {
    let env = new Environment(this.global);
    let bag = new RuntimeBag();
    let ctx = new Context(fileName, bag, env, this);
    this.contexts.set(fileName, ctx);

    return ctx;
  }

  public getContext(fileName: string) {
    return this.contexts.get(fileName);
  }

  private _prepareGlobal() {
    this.global.set("$print", async (ctx) => {
      console.log(...(await ctx.evaluateArgs(ctx.getArgs())));
      return "";
    });

    this.global.set("$async", (ctx) => {
      new Promise((res, rej) => {
        ctx.evaluateArgs(ctx.getArgs()).then(res).catch(rej);
      });
      return "";
    });

    this.global.set("$wait", async (ctx) => {
      const [time = 1] = await ctx.evaluateArgs(ctx.getArgs(0, 1));
      return new Promise((res) => setTimeout(() => res(""), time * 1000));
    });

    this.global.set("$filename", (ctx) => ctx.fileName);
    this.global.set("$dirname", (ctx) => path.join(ctx.fileName, ".."));
    this.global.set("$random", (ctx) => Math.random());
    this.global.set("$if", async (ctx) => {
      ctx.argsCheck(2); // Requires 2 arguments
      const [condition, ifTrue, ifFalse] = ctx.getArgs(0, 3);
      const op_idx = condition.child.findIndex((v) => v.type === "operator");
      const op = condition.child[op_idx] as TokenOperator;
      //   if (!op) return Boolean(await ctx.evaluateArgs([condition])) ? ctx.evaluateArgs([ifTrue]) : ctx.evaluateArgs([ifFalse]);
      const [cond_a, cond_b] = await ctx.evaluateArgs([
        { type: "argument", child: condition.child.slice(0, op_idx) },
        { type: "argument", child: condition.child.slice(op_idx + 1) },
      ]);
      let res: boolean;
      switch (op.value) {
        case "==":
          res = cond_a === cond_b;
          break;
        case "!=":
          res = cond_a !== cond_b;
          break;
        case ">=":
          res = cond_a >= cond_b;
          break;
        case ">":
          res = cond_a > cond_b;
          break;
        case "<=":
          res = cond_a <= cond_b;
          break;
        case "<":
          res = cond_a < cond_b;
          break;
      }
      if (res === true) return ctx.evaluateArgs([ifTrue]);
      if (res === false) return ctx.evaluateArgs([ifFalse]);
      throw new Error("Invalid operator!");
    });
    this.global.set('$safejs', async (ctx) => {
      const evalCode = await ctx.evaluateArgs(ctx.getArgs(0));
      const mask = {
        ctx,
        runtime: this,
        evaluator: this.evaluator,
        global
      }
      const res = (new Function( "with(this) {'use strict';\n" + evalCode + "}").call(mask));
      return res;
    });
    this.global.set("$def", async (ctx) => {
      ctx.argsCheck(3);
      const [fnarg, mapReturn, body] = ctx.getArgs();
      let fnName: string;
      if (
        fnarg.child[0]?.type === "call" ||
        fnarg.child[0]?.type === "string"
      ) {
        fnName =
          (fnarg.child[0].type === "string" ? "$" : "") + fnarg.child[0].value;
      } else throw new Error("FnName must be typeof string or call!");

      ctx.env.set(fnName, (ctx) => {
        return this.evaluator.visitArgument(
          body,
          ctx,
          mapReturn.child[0]?.type === "string" &&
            ["yes", "true"].includes(mapReturn.child[0]?.value?.toLowerCase?.())
        );
      });
      return '';
    });
    this.global.set("$max", async (ctx) => {
      const nums = await ctx.evaluateArgs(ctx.getArgs());
      return Math.max(...nums);
    });
    this.global.set("$min", async (ctx) => {
      const nums = await ctx.evaluateArgs(ctx.getArgs());
      return Math.min(...nums);
    });
    this.global.set("$round", async (ctx) => {
      return Math.round(await ctx.evaluateArgs(ctx.getArgs(0, 1))[0]);
    });
    this.global.set("$floor", async (ctx) => {
      return Math.floor(await ctx.evaluateArgs(ctx.getArgs(0, 1))[0]);
    });
    this.global.set("$trunc", async (ctx) => {
      return Math.trunc(await ctx.evaluateArgs(ctx.getArgs(0, 1))[0]);
    });
    this.global.set("$sum", async (ctx) => {
      const nums = await ctx.evaluateArgs(ctx.getArgs());
      return nums.reduce((prev, v) => {
        prev += v;
        return prev;
      }, 0);
    });
    this.global.set("$sub", async (ctx) => {
      const nums = await ctx.evaluateArgs(ctx.getArgs());
      return nums.reduce((prev, v) => {
        prev -= v;
        return prev;
      }, 0);
    });
    this.global.set("$multi", async (ctx) => {
      const nums = await ctx.evaluateArgs(ctx.getArgs());
      return nums.reduce((prev, v) => {
        prev *= v;
        return prev;
      }, 0);
    });
    this.global.set("$div", async (ctx) => {
      const nums = await ctx.evaluateArgs(ctx.getArgs());
      return nums.reduce((prev, v) => {
        prev /= v;
        return prev;
      }, 0);
    });
    this.global.set("$modulo", async (ctx) => {
      const nums = await ctx.evaluateArgs(ctx.getArgs(0, 2));
      return nums.shift() % nums.shift();
    });
  }
}

export { Runtime, RuntimeOptions };
