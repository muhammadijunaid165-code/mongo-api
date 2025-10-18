from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

# Lazy placeholders; replace with real models in prod init

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/parse_resume")
def parse_resume():
    data = request.get_json(force=True)
    url = data.get("url")
    # Placeholder parse
    parsed = {
        "skills": ["python", "javascript"],
        "education": ["BSc Computer Science"],
        "experience": ["2 years software engineer"]
    }
    return jsonify({"text": f"Extracted text from {url}" if url else "", "parsed": parsed})

@app.post("/match_score")
def match_score():
    body = request.get_json(force=True)
    resume_text = body.get("resume_text", "")
    job_desc = body.get("job_description", "")
    # Simple heuristic placeholder
    score = min(100, int(len(set(resume_text.lower().split()) & set(job_desc.lower().split())) * 5))
    return jsonify({"score": score})

@app.post("/generate_questions")
def generate_questions():
    body = request.get_json(force=True)
    count = int(body.get("count", 5))
    qs = [f"Question {i+1}: Describe your experience with X?" for i in range(count)]
    return jsonify({"questions": qs})

@app.post("/evaluate_answers")
def evaluate_answers():
    body = request.get_json(force=True)
    qa = body.get("qa", [])
    scores = [min(10, max(0, len((item.get("answer") or "").split()) // 5)) ) for item in qa]
    return jsonify({"scores": scores})

@app.post("/feedback_summary")
def feedback_summary():
    body = request.get_json(force=True)
    qa = body.get("qa", [])
    summary = "Candidate provided concise answers."
    return jsonify({"summary": summary})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
