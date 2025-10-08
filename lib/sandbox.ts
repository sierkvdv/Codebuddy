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
      Date: Date,
      // Explicitly exclude dangerous globals
      eval: undefined,
      Function: undefined,
      setTimeout: undefined,
      setInterval: undefined,
      fetch: undefined,
      XMLHttpRequest: undefined,
    };

    // Simple approach: just execute the code and see what happens
    const wrappedCode = `
      ${code}
      
      // Try to call main function if it exists
      if (typeof main === 'function') {
        return main(${JSON.stringify(testInput)});
      }
      
      // If no main function, return undefined (code executed but no return value)
      return undefined;
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
    // Extract function name from code (simple regex)
    const functionMatch = code.match(/function\s+(\w+)\s*\(/);
    const functionName = functionMatch ? functionMatch[1] : null;
    
    let result;
    if (functionName) {
      // Create code that calls the function with test input
      const testCode = `${code}\nreturn ${functionName}(${JSON.stringify(test.input)});`;
      result = runCodeInSandbox(testCode);
    } else {
      // Fallback to original approach
      result = runCodeInSandbox(code, test.input);
    }
    
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

