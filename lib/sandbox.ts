/**
 * Safe code execution sandbox for client-side code evaluation
 * This provides a restricted environment to run user code safely
 */

export interface SandboxResult {
  success: boolean;
  output?: any;
  error?: string;
  logs?: string[];
}

export function runCodeInSandbox(code: string, testInput?: any): SandboxResult {
  const logs: string[] = [];
  
  try {
    // Create a sandboxed console
    const sandboxConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(arg => String(arg)).join(" "));
      },
      error: (...args: any[]) => {
        logs.push("ERROR: " + args.map(arg => String(arg)).join(" "));
      },
      warn: (...args: any[]) => {
        logs.push("WARN: " + args.map(arg => String(arg)).join(" "));
      },
    };

    // Create a restricted global scope
    const sandbox = {
      console: sandboxConsole,
      Math,
      Array,
      String,
      Number,
      Boolean,
      Object,
      JSON,
      Date: Date, // Allow but note: could be used for timing attacks
      // Explicitly exclude dangerous globals
      eval: undefined,
      Function: undefined,
      setTimeout: undefined,
      setInterval: undefined,
      fetch: undefined,
      XMLHttpRequest: undefined,
    };

    // Wrap the code in a function to isolate scope
    const wrappedCode = `
      "use strict";
      ${code}
      
      // If there's a main function defined, call it
      if (typeof main === 'function') {
        return main(${JSON.stringify(testInput)});
      }
    `;

    // Create function with restricted scope
    const func = new Function(...Object.keys(sandbox), wrappedCode);
    const result = func(...Object.values(sandbox));

    return {
      success: true,
      output: result,
      logs,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      logs,
    };
  }
}

// Run multiple test cases
export function runTests(code: string, tests: Array<{ input: any; expectedOutput: any; description?: string }>) {
  return tests.map((test) => {
    const result = runCodeInSandbox(code, test.input);
    
    return {
      passed: result.success && JSON.stringify(result.output) === JSON.stringify(test.expectedOutput),
      input: test.input,
      expected: test.expectedOutput,
      actual: result.output,
      error: result.error,
      logs: result.logs,
    };
  });
}

