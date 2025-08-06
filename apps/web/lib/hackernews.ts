export interface HackerNewsItem {
  id: number;
  deleted?: boolean;
  type?: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export interface ProjectInspiration {
  title: string;
  url?: string;
  summary: string;
  keywords: string[];
  score?: number;
  inspirationType: 'trending' | 'tech' | 'tool' | 'game' | 'creative';
}

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

// Cache for API responses to avoid hitting rate limits
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function cachedFetch<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  
  const data = await response.json();
  cache.set(url, { data, timestamp: now });
  
  return data;
}

export async function getTopStories(limit: number = 10): Promise<HackerNewsItem[]> {
  try {
    const topStoryIds = await cachedFetch<number[]>(`${HN_API_BASE}/topstories.json`);
    const storyPromises = topStoryIds
      .slice(0, limit)
      .map(id => cachedFetch<HackerNewsItem>(`${HN_API_BASE}/item/${id}.json`));
    
    return await Promise.all(storyPromises);
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return [];
  }
}

export async function getNewStories(limit: number = 10): Promise<HackerNewsItem[]> {
  try {
    const newStoryIds = await cachedFetch<number[]>(`${HN_API_BASE}/newstories.json`);
    const storyPromises = newStoryIds
      .slice(0, limit)
      .map(id => cachedFetch<HackerNewsItem>(`${HN_API_BASE}/item/${id}.json`));
    
    return await Promise.all(storyPromises);
  } catch (error) {
    console.error('Error fetching new stories:', error);
    return [];
  }
}

export async function getBestStories(limit: number = 10): Promise<HackerNewsItem[]> {
  try {
    const bestStoryIds = await cachedFetch<number[]>(`${HN_API_BASE}/beststories.json`);
    const storyPromises = bestStoryIds
      .slice(0, limit)
      .map(id => cachedFetch<HackerNewsItem>(`${HN_API_BASE}/item/${id}.json`));
    
    return await Promise.all(storyPromises);
  } catch (error) {
    console.error('Error fetching best stories:', error);
    return [];
  }
}

export function extractKeywords(title: string, url?: string): string[] {
  const text = `${title} ${url || ''}`.toLowerCase();
  
  // Technology keywords that often indicate interesting projects
  const techKeywords = [
    'ai', 'ml', 'machine learning', 'artificial intelligence',
    'javascript', 'typescript', 'react', 'vue', 'svelte', 'next.js',
    'python', 'rust', 'go', 'webassembly', 'wasm',
    'game', 'graphics', 'webgl', 'threejs', 'canvas',
    'api', 'database', 'visualization', 'chart',
    'crypto', 'blockchain', 'nft',
    'tool', 'utility', 'generator', 'converter',
    'animation', 'creative', 'art', 'music',
    'productivity', 'automation', 'workflow',
    'mobile', 'app', 'pwa', 'web app',
    'security', 'privacy', 'encryption',
    'open source', 'github', 'library', 'framework'
  ];
  
  return techKeywords.filter(keyword => text.includes(keyword));
}

export function categorizeInspiration(item: HackerNewsItem): ProjectInspiration['inspirationType'] {
  const title = (item.title || '').toLowerCase();
  const url = (item.url || '').toLowerCase();
  const text = `${title} ${url}`;
  
  if (text.match(/game|play|puzzle|arcade|chess|cards/)) {
    return 'game';
  }
  
  if (text.match(/tool|utility|generator|converter|calculator|formatter/)) {
    return 'tool';
  }
  
  if (text.match(/art|creative|music|animation|drawing|design|color/)) {
    return 'creative';
  }
  
  if (text.match(/javascript|typescript|react|vue|python|rust|framework|library|api/)) {
    return 'tech';
  }
  
  return 'trending';
}

export async function getProjectInspiration(limit: number = 20): Promise<ProjectInspiration[]> {
  try {
    // Get a mix of top, new, and best stories
    const [topStories, newStories, bestStories] = await Promise.all([
      getTopStories(8),
      getNewStories(8),
      getBestStories(4)
    ]);
    
    const allStories = [...topStories, ...newStories, ...bestStories];
    
    const inspirations: ProjectInspiration[] = allStories
      .filter(story => story.title && story.score && story.score > 5) // Filter quality content
      .map(story => {
        const keywords = extractKeywords(story.title!, story.url);
        const inspirationType = categorizeInspiration(story);
        
        return {
          title: story.title!,
          url: story.url,
          summary: generateSummary(story),
          keywords,
          score: story.score,
          inspirationType,
        };
      })
      .filter(inspiration => inspiration.keywords.length > 0) // Only items with relevant keywords
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
    
    return inspirations;
  } catch (error) {
    console.error('Error getting project inspiration:', error);
    return [];
  }
}

function generateSummary(item: HackerNewsItem): string {
  const title = item.title || '';
  const url = item.url || '';
  
  // Extract domain for context
  let domain = '';
  if (url) {
    try {
      domain = new URL(url).hostname.replace('www.', '');
    } catch {
      // Invalid URL, ignore
    }
  }
  
  // Generate a simple summary based on keywords and context
  const keywords = extractKeywords(title, url);
  const category = categorizeInspiration(item);
  
  let summary = `${category.charAt(0).toUpperCase() + category.slice(1)} inspiration: ${title}`;
  
  if (domain) {
    summary += ` (from ${domain})`;
  }
  
  if (keywords.length > 0) {
    summary += `. Related to: ${keywords.slice(0, 3).join(', ')}`;
  }
  
  return summary;
}

export async function getTrendingTechnologies(): Promise<string[]> {
  try {
    const inspirations = await getProjectInspiration(50);
    const keywordCounts = new Map<string, number>();
    
    inspirations.forEach(inspiration => {
      inspiration.keywords.forEach(keyword => {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
      });
    });
    
    return Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword]) => keyword);
  } catch (error) {
    console.error('Error getting trending technologies:', error);
    return [];
  }
}

// Project idea generator based on HN trends
export async function generateProjectIdeas(): Promise<Array<{
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  keywords: string[];
}>> {
  const inspirations = await getProjectInspiration(30);
  const trending = await getTrendingTechnologies();
  
  const ideas = [];
  
  // Generate ideas based on trending topics
  for (const tech of trending.slice(0, 5)) {
    const relatedInspirations = inspirations.filter(i => i.keywords.includes(tech));
    
    if (relatedInspirations.length > 0) {
      const inspiration = relatedInspirations[0];
      
      ideas.push({
        title: `Interactive ${tech.charAt(0).toUpperCase() + tech.slice(1)} Demo`,
        description: `Create an engaging demonstration or tool related to ${tech}, inspired by: ${inspiration?.title || ''}`,
        category: inspiration?.inspirationType || 'trending',
        difficulty: getDifficulty(tech),
        keywords: [tech, ...(inspiration?.keywords.slice(0, 3) || [])], // @ts-ignore
      });
    }
  }
  
  // Add some general creative ideas
  const creativeIdeas = [
    {
      title: 'Trending Topic Visualizer',
      description: 'Real-time visualization of HackerNews trending topics and keywords',
      category: 'visualization',
      difficulty: 'medium' as const,
      keywords: ['data', 'visualization', 'real-time'],
    },
    {
      title: 'Interactive Code Playground',
      description: 'Browser-based code editor with live preview for popular languages',
      category: 'tool',
      difficulty: 'hard' as const,
      keywords: ['code', 'editor', 'playground'],
    },
    {
      title: 'Minimalist Game Collection',
      description: 'Simple but addictive browser games inspired by current trends',
      category: 'game',
      difficulty: 'easy' as const,
      keywords: ['game', 'minimal', 'browser'],
    },
  ];
  
  return [...ideas, ...creativeIdeas].slice(0, 10);
}

function getDifficulty(tech: string): 'easy' | 'medium' | 'hard' {
  const easyTech = ['html', 'css', 'color', 'text', 'simple'];
  const hardTech = ['webassembly', 'wasm', 'machine learning', 'ai', 'blockchain', 'crypto'];
  
  if (easyTech.some(easy => tech.includes(easy))) return 'easy';
  if (hardTech.some(hard => tech.includes(hard))) return 'hard';
  return 'medium';
}