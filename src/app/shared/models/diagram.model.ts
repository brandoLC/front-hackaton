export interface Diagram {
  id: string;
  title: string;
  description?: string;
  type: DiagramType;
  code: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export enum DiagramType {
  AWS = 'aws',
  ER = 'er',
  JSON = 'json',
  MERMAID = 'mermaid',
  SQL = 'sql',
}

export interface DiagramCreateRequest {
  title: string;
  description?: string;
  type: DiagramType;
  code: string;
}

export interface DiagramGenerateRequest {
  code: string;
  type: DiagramType;
}

export interface DiagramGenerateResponse {
  imageUrl: string;
  diagram?: Diagram;
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf';
  quality?: number;
  width?: number;
  height?: number;
}
