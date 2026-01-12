from core.ingestion.loader import load_text
from core.pipelines.config import PIPELINES
from core.pipelines.runner import run_pipeline
from core.evaluation.scorer import score_pipeline

TEXT_PATH = "experiments/sample_data/sample.txt"


def run():
    text = load_text(TEXT_PATH)
    question = "What is this document about?"

    results = []

    print("\nRUNNING PIPELINES...\n")

    for config in PIPELINES:
        output = run_pipeline(text, question, config)
        scores = score_pipeline(output)

        results.append({
            "config": config,
            "output": output,
            "scores": scores
        })

    print("\nPIPELINE OUTPUTS + SCORES\n")

    for r in results:
        print("=" * 80)
        print(f"PIPELINE: {r['scores']['pipeline']}")
        print(f"Chunk size: {r['config']['chunk_size']}")
        print(f"Embedding model: {r['config']['embedding_model']}")
        print(f"Latency: {r['scores']['latency']}s")
        print(f"Cost (token proxy): {r['scores']['cost']}")
        print()

        print("🔹 Retrieved Chunks:")
        for i, chunk in enumerate(r["output"]["retrieved_chunks"], 1):
            print(f"\n[{i}] {chunk}")

        print("\n🔹 Generated Answer:")
        print(r["output"]["answer"])

        print("\n🔹 Evaluation Scores:")
        print(f"Faithfulness     : {r['scores']['faithfulness']}")
        print(f"Relevance        : {r['scores']['relevance']}")
        print(f"Context Recall   : {r['scores']['context_recall']}")

        print("=" * 80)
        print()

    # Ranking
    print("\nFINAL RANKING (Best → Worst)\n")

    ranked = sorted(
        results,
        key=lambda x: (
            x["scores"]["faithfulness"],
            x["scores"]["relevance"],
            -x["scores"]["cost"],
            -x["scores"]["latency"],
        ),
        reverse=True,
    )

    for rank, r in enumerate(ranked, 1):
        s = r["scores"]
        print(
            f"{rank}. {s['pipeline']} | "
            f"faith={s['faithfulness']} | "
            f"rel={s['relevance']} | "
            f"recall={s['context_recall']} | "
            f"cost={s['cost']} | "
            f"lat={s['latency']}s"
        )


if __name__ == "__main__":
    run()
