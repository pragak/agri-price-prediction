import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PricePrediction() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/predict/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPredictions(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Agriculture Price Prediction</h1>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} className="mt-4" disabled={loading}>
        {loading ? "Predicting..." : "Upload & Predict"}
      </Button>
      {predictions.length > 0 && (
        <Card className="mt-6">
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Predicted Prices</h2>
            <ul>
              {predictions.map((item, index) => (
                <li key={index} className="border-b py-2">
                  {item.Commodity}: ₹{item.Predicted_Price.toFixed(2)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}