// Math and logic utility functions for puzzle tasks

/**
 * Generate a random prime number between min and max
 */
export function randomPrime(min: number, max: number): number {
  const primes = generatePrimes(max);
  const validPrimes = primes.filter(p => p >= min && p <= max);
  if (validPrimes.length === 0) {
    throw new Error(`No primes found between ${min} and ${max}`);
  }
  return validPrimes[Math.floor(Math.random() * validPrimes.length)]!;
}

/**
 * Generate all prime numbers up to n using Sieve of Eratosthenes
 */
export function generatePrimes(n: number): number[] {
  const sieve = Array(n + 1).fill(true);
  sieve[0] = sieve[1] = false;

  for (let i = 2; i * i <= n; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= n; j += i) {
        sieve[j] = false;
      }
    }
  }

  return sieve.map((isPrime, index) => isPrime ? index : -1).filter(x => x !== -1);
}

/**
 * Check if a number is prime
 */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * Calculate factorial
 */
export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

/**
 * Calculate Fibonacci sequence up to n terms
 */
export function fibonacci(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib[i] = fib[i - 1]! + fib[i - 2]!;
  }
  return fib;
}

/**
 * Calculate nth Fibonacci number efficiently
 */
export function fibonacciNth(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

/**
 * Calculate greatest common divisor
 */
export function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return Math.abs(a);
}

/**
 * Calculate least common multiple
 */
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Generate arithmetic sequence
 */
export function arithmeticSequence(start: number, step: number, length: number): number[] {
  return Array.from({ length }, (_, i) => start + i * step);
}

/**
 * Generate geometric sequence
 */
export function geometricSequence(start: number, ratio: number, length: number): number[] {
  return Array.from({ length }, (_, i) => start * Math.pow(ratio, i));
}

/**
 * Convert number to binary string
 */
export function toBinary(n: number): string {
  return n.toString(2);
}

/**
 * Convert number to hexadecimal string
 */
export function toHex(n: number): string {
  return n.toString(16).toUpperCase();
}

/**
 * Convert number from any base to decimal
 */
export function fromBase(value: string, base: number): number {
  return parseInt(value, base);
}

/**
 * Convert decimal to any base
 */
export function toBase(n: number, base: number): string {
  return n.toString(base).toUpperCase();
}

/**
 * Generate a random mathematical expression
 */
export function generateMathExpression(difficulty: 'easy' | 'medium' | 'hard'): {
  expression: string;
  answer: number;
} {
  const operators = ['+', '-', '*'];
  
  let a: number, b: number, operator: string;
  
  switch (difficulty) {
    case 'easy':
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      operator = operators[Math.floor(Math.random() * 2)]!; // Only + and -
      break;
    case 'medium':
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      operator = operators[Math.floor(Math.random() * 3)]!; // +, -, *
      break;
    case 'hard':
      a = Math.floor(Math.random() * 100) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      operator = operators[Math.floor(Math.random() * 3)]!;
      // Add division for hard mode
      if (Math.random() < 0.25) {
        operator = '/';
        // Ensure clean division
        a = b * Math.floor(Math.random() * 10 + 1);
      }
      break;
    default:
      a = 1;
      b = 1;
      operator = '+';
      break;
  }

  let answer: number;
  switch (operator) {
    case '+':
      answer = a + b;
      break;
    case '-':
      answer = a - b;
      break;
    case '*':
      answer = a * b;
      break;
    case '/':
      answer = a / b;
      break;
    default:
      answer = a + b;
  }

  return {
    expression: `${a} ${operator} ${b}`,
    answer
  };
}

/**
 * Generate a sequence puzzle
 */
export function generateSequencePuzzle(): {
  sequence: number[];
  nextNumber: number;
  type: 'arithmetic' | 'geometric' | 'fibonacci' | 'prime' | 'square';
} {
  const types = ['arithmetic', 'geometric', 'fibonacci', 'prime', 'square'] as const;
  const type = types[Math.floor(Math.random() * types.length)]!;
  
  switch (type) {
    case 'arithmetic': {
      const start = Math.floor(Math.random() * 20) + 1;
      const step = Math.floor(Math.random() * 10) + 1;
      const sequence = arithmeticSequence(start, step, 4);
      const lastNumber = sequence[sequence.length - 1];
      if (lastNumber === undefined) throw new Error('Empty sequence');
      return {
        sequence,
        nextNumber: lastNumber + step,
        type
      };
    }
    case 'geometric': {
      const start = Math.floor(Math.random() * 5) + 1;
      const ratio = Math.floor(Math.random() * 3) + 2;
      const sequence = geometricSequence(start, ratio, 4);
      const lastNumber = sequence[sequence.length - 1];
      if (lastNumber === undefined) throw new Error('Empty sequence');
      return {
        sequence,
        nextNumber: lastNumber * ratio,
        type
      };
    }
    case 'fibonacci': {
      const sequence = fibonacci(6).slice(1); // Skip the first 0
      const nextNumber = sequence[4];
      if (nextNumber === undefined) throw new Error('Invalid fibonacci sequence');
      return {
        sequence: sequence.slice(0, 4),
        nextNumber,
        type
      };
    }
    case 'prime': {
      const primes = generatePrimes(100);
      const startIndex = Math.floor(Math.random() * (primes.length - 5));
      const sequence = primes.slice(startIndex, startIndex + 4);
      const nextNumber = primes[startIndex + 4];
      if (nextNumber === undefined) throw new Error('Invalid prime sequence');
      return {
        sequence,
        nextNumber,
        type
      };
    }
    case 'square': {
      const start = Math.floor(Math.random() * 5) + 1;
      const sequence = Array.from({ length: 4 }, (_, i) => (start + i) ** 2);
      return {
        sequence,
        nextNumber: (start + 4) ** 2,
        type
      };
    }
    default:
      throw new Error(`Unknown sequence type: ${type}`);
  }
}

/**
 * Check if a point is inside a polygon (ray casting algorithm)
 */
export function pointInPolygon(point: { x: number; y: number }, polygon: Array<{ x: number; y: number }>): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i];
    const pj = polygon[j];
    if (!pi || !pj) continue;
    
    if (
      pi.y > point.y !== pj.y > point.y &&
      point.x < (pj.x - pi.x) * (point.y - pi.y) / (pj.y - pi.y) + pi.x
    ) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Calculate angle between two points in radians
 */
export function angleBetweenPoints(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  return Math.atan2(point2.y - point1.y, point2.x - point1.x);
}

/**
 * Calculate angle between two points in degrees
 */
export function angleBetweenPointsDegrees(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  return angleBetweenPoints(point1, point2) * (180 / Math.PI);
}
