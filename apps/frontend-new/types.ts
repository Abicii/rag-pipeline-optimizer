export interface Metric {
  name: string;
  value: number; // 0 to 1
  description: string;
  color: string;
}

export interface PipelineConfig {
  id: string;
  name: string;
  chunkingStrategy: string;
  embeddingModel: string;
  vectorDb: string;
  rank: number;
}

export interface SimulationResult {
  pipeline: string
  chunk_size: number
  embedding_model: string
  latency: number
  retrieved_chunks: string[]
  answer: string
  scores: {
    faithfulness: number
    relevance: number
    context_recall: number
    latency: number
    cost: number
  }
}



export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING', // File dropped, visual feedback
  READY = 'READY', // File parsed, ready for query
  PROCESSING = 'PROCESSING', // Animation running
  COMPLETE = 'COMPLETE' // Showing results
}

export type ProcessingStage = 'document' | 'chunking' | 'embedding' | 'vector' | 'generation' | 'evaluation';

export const STAGES: { id: ProcessingStage; label: string }[] = [
  { id: 'document', label: 'Ingestion' },
  { id: 'chunking', label: 'Chunking' },
  { id: 'embedding', label: 'Embedding' },
  { id: 'vector', label: 'Vector Search' },
  { id: 'generation', label: 'Generation' },
  { id: 'evaluation', label: 'Eval' },
];