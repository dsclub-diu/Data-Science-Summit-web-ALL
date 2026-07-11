# Isolated judging environment for the Starship Safety hackathon.
# Dependencies (and their pinned versions) live in requirements.txt, which is
# the single source of truth for both the judge and the versions participants
# must build against. joblib is included because models are saved with it.
FROM python:3.11-slim

WORKDIR /hackathon/judging
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Mount the project at runtime and run from the project root; see README.md:
#   docker run --rm --network none --cpus 2 --memory 4g \
#     -v "$PWD":/hackathon -w /hackathon/judging starship-judge \
#     python evaluate.py
#
# The evaluator hands each model only a COPY of test-x.csv in a scratch dir,
# never test-y.csv. For a fully hostile field, run model execution in a
# container that has ONLY test-x.csv mounted and score outside it.
CMD ["python", "evaluate.py"]
