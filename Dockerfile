# Isolated judging environment for the Starship Safety hackathon.
# Install every library participants are allowed to use, with pinned
# versions, and PUBLISH THIS LIST to participants — a pickle saved under a
# different sklearn/xgboost version may fail to load here. joblib is included
# because it is the standard way to save/compress sklearn models.
FROM python:3.11-slim

RUN pip install --no-cache-dir \
    pandas==2.2.3 \
    numpy==2.1.3 \
    scikit-learn==1.6.1 \
    joblib==1.4.2 \
    xgboost==2.1.3 \
    lightgbm==4.5.0

WORKDIR /hackathon/judging

# Mount the project at runtime and run from the project root; see README.md:
#   docker run --rm --network none --cpus 2 --memory 4g \
#     -v "$PWD":/hackathon -w /hackathon/judging starship-judge \
#     python evaluate.py
#
# The evaluator hands each model only a COPY of test-x.csv in a scratch dir,
# never test-y.csv. For a fully hostile field, run model execution in a
# container that has ONLY test-x.csv mounted and score outside it.
CMD ["python", "evaluate.py"]
