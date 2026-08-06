export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'text' | 'image' | 'dev' | 'math';
  path: string;
  icon: string;
  tags: string[];
}

export const TOOLS: Tool[] = [
];