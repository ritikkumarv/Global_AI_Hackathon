from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
import os

os.environ["NVIDIA_API_KEY"] = "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"
try:
    embeddings = NVIDIAEmbeddings(
        model="nvidia/nv-embedqa-e5-v5",
    )
    res = embeddings.embed_query("What is the latest news?")
    print("Success:", len(res))
except Exception as e:
    print("Error:", e)
