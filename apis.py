from fastapi import FastAPI, UploadFile, File
import pandas as pd
import pickle
import uvicorn

# Load the trained model
MODEL_PATH = "model.pkl"
with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

# Initialize FastAPI app
app = FastAPI()

@app.post("/predict/")
async def predict_price(file: UploadFile = File(...)):
    """Predict commodity prices based on uploaded CSV file."""
    df = pd.read_csv(file.file)
    predictions = model.predict(df)
    df["Predicted_Price"] = predictions
    return df.to_dict(orient="records")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
