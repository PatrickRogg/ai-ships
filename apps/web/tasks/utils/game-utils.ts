// Game utility functions for task components

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp!;
  }
  return shuffled;
}

/**
 * Pick a random element from an array
 */
export function randomChoice<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot pick from empty array');
  }
  return array[Math.floor(Math.random() * array.length)]!;
}

/**
 * Pick multiple random elements from an array (without replacement)
 */
export function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}

/**
 * Generate a random color in hex format
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Generate a random RGB color object
 */
export function randomRGB(): { r: number; g: number; b: number } {
  return {
    r: randomInt(0, 255),
    g: randomInt(0, 255),
    b: randomInt(0, 255)
  };
}

/**
 * Generate a random HSL color object
 */
export function randomHSL(): { h: number; s: number; l: number } {
  return {
    h: randomInt(0, 360),
    s: randomInt(0, 100),
    l: randomInt(20, 80) // Avoid too dark or too light colors
  };
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if two rectangles overlap
 */
export function rectanglesOverlap(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );
}

/**
 * Calculate distance between two points
 */
export function distance(
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Simple timer class for game mechanics
 */
export class GameTimer {
  private startTime: number;
  private duration: number;
  private paused: boolean = false;
  private pausedTime: number = 0;

  constructor(durationMs: number) {
    this.startTime = Date.now();
    this.duration = durationMs;
  }

  getRemainingTime(): number {
    if (this.paused) {
      return Math.max(0, this.duration - this.pausedTime);
    }
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.duration - elapsed);
  }

  isExpired(): boolean {
    return this.getRemainingTime() === 0;
  }

  pause(): void {
    if (!this.paused) {
      this.pausedTime = Date.now() - this.startTime;
      this.paused = true;
    }
  }

  resume(): void {
    if (this.paused) {
      this.startTime = Date.now() - this.pausedTime;
      this.paused = false;
    }
  }

  reset(newDuration?: number): void {
    this.startTime = Date.now();
    if (newDuration !== undefined) {
      this.duration = newDuration;
    }
    this.paused = false;
    this.pausedTime = 0;
  }
}

/**
 * Score formatting utilities
 */
export function formatScore(score: number): string {
  if (score >= 1000000) {
    return (score / 1000000).toFixed(1) + 'M';
  }
  if (score >= 1000) {
    return (score / 1000).toFixed(1) + 'K';
  }
  return score.toString();
}

/**
 * Time formatting utilities
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate a grid of positions
 */
export function generateGrid(
  width: number,
  height: number,
  cols: number,
  rows: number
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        x: col * cellWidth + cellWidth / 2,
        y: row * cellHeight + cellHeight / 2
      });
    }
  }

  return positions;
}

/**
 * Animate a value from start to end over a duration
 */
export function animateValue(
  start: number,
  end: number,
  duration: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
): () => void {
  const startTime = Date.now();
  const range = end - start;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = start + range * easedProgress;
    
    onUpdate(currentValue);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  };

  const animationFrame = requestAnimationFrame(animate);
  
  // Return cancel function
  return () => cancelAnimationFrame(animationFrame);
}