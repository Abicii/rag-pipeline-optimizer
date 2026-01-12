from core.ingestion.loader import load_text
from core.pipelines.config import PIPELINES
from core.pipelines.runner import run_pipeline

TEXT_PATH = "experiments/sample_data/sample.txt"

def run():
    text = load_text(TEXT_PATH)
    question = "What is this document about?"

    results = []

    for config in PIPELINES:
        print(f"\nRunning {config['name']}...")
        output = run_pipeline(text, question, config)
        results.append(output)

    for r in results:
        print("\n" + "=" * 40)
        print(f"Pipeline: {r['pipeline']}")
        print(f"Chunk size: {r['chunk_size']}")
        print(f"Embedding: {r['embedding_model']}")
        print(f"Latency: {r['latency']}s")
        print("Answer:")
        print(r["answer"])


if __name__ == "__main__":
    run()
