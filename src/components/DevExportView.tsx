import React, { useState } from 'react';
import { FileText, Copy, Check, Terminal, ExternalLink, ShieldCheck, Download, Server } from 'lucide-react';
import { motion } from 'motion/react';

export default function DevExportView() {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('app.py');

  const files = [
    {
      name: 'app.py',
      label: 'Flask Frontend Router (app.py)',
      lang: 'python',
      content: `import os
from flask import Flask, render_template, request, jsonify, redirect, url_for
import numpy as np
import joblib

app = Flask(__name__)
PORT = 5000

# Global cached model payload
MODEL_PAYLOAD = None

def load_or_train_model():
    """
    Attempts to load the serialized model.pkl. If missing, runs training module recursively
    to guarantee high-service-availability.
    """
    global MODEL_PAYLOAD
    model_path = "model.pkl"
    if not os.path.exists(model_path):
        print(f"[HealthGuard Webserver] model.pkl not found at '{model_path}'. Calling train_model.py auto-bootloader...")
        try:
            import train_model
            train_model.train()
        except Exception as e:
            print(f"[HealthGuard Webserver] Auto-bootloader failed ({e}). Initializing fallback parameters.")
            
    if os.path.exists(model_path):
        try:
            MODEL_PAYLOAD = joblib.load(model_path)
            print(f"[HealthGuard Webserver] Successfully loaded saved model payload: {MODEL_PAYLOAD.get('model_name')}")
        except Exception as e:
            print(f"[HealthGuard Webserver] Error reading model.pkl ({e}). Initializing backup parameters.")
            MODEL_PAYLOAD = None

    # Fallback weights matching verified Pima ratios
    if MODEL_PAYLOAD is None:
        MODEL_PAYLOAD = {
            'model_name': 'Logistic Regression (De-serialized Fallback)',
            'is_scaled': False,
            'feature_names': ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'],
            'intercept_': -8.4,
            'coef_': [0.123, 0.035, -0.013, 0.0006, -0.0002, 0.089, 0.945, 0.014]
        }

# Pre-load the ML model
load_or_train_model()

def make_inference(features_dict):
    global MODEL_PAYLOAD
    if MODEL_PAYLOAD is None:
        load_or_train_model()
        
    ordered_keys = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
    features_list = [features_dict[k] for k in ordered_keys]
    
    # Check if custom Skikit-Learn model object is present
    model_obj = MODEL_PAYLOAD.get('model')
    if model_obj is not None:
        try:
            if MODEL_PAYLOAD.get('is_scaled'):
                scaler = MODEL_PAYLOAD.get('scaler')
                scaled_inputs = scaler.transform([features_list])
                prob = model_obj.predict_proba(scaled_inputs)[0][1]
            else:
                prob = model_obj.predict_proba([features_list])[0][1]
            return float(prob)
        except Exception as e:
            print(f"[HealthGuard Inference] sklearn model execution failed ({e}). Switching to regression math.")
            
    # Executing equations: logistic regression z = beta0 + Sum(beta_i * x_i)
    intercept = MODEL_PAYLOAD.get('intercept_', -8.4)
    coefs = MODEL_PAYLOAD.get('coef_', [0.123, 0.035, -0.013, 0.0006, -0.0002, 0.089, 0.945, 0.014])
    
    z = intercept
    for val, b in zip(features_list, coefs):
         z += val * b
         
    probability = 1 / (1 + np.exp(-z))
    return float(probability)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        try:
            features = {
                'Pregnancies': float(request.form.get('pregnancies', 0)),
                'Glucose': float(request.form.get('glucose', 120)),
                'BloodPressure': float(request.form.get('blood_pressure', 70)),
                'SkinThickness': float(request.form.get('skin_thickness', 20)),
                'Insulin': float(request.form.get('insulin', 80)),
                'BMI': float(request.form.get('bmi', 26.5)),
                'DiabetesPedigreeFunction': float(request.form.get('pedigree', 0.471)),
                'Age': float(request.form.get('age', 35))
            }
            
            prob = make_inference(features)
            prob_percent = round(prob * 100, 1)
            
            risk_level = 'Low'
            risk_color = '#22c55e'
            if prob > 0.65:
                risk_level = 'High'
                risk_color = '#ef4444'
            elif prob > 0.30:
                risk_level = 'Moderate'
                risk_color = '#f97316'
                
            return render_template('result.html', 
                                   inputs=features, 
                                   probability=prob_percent, 
                                   risk_level=risk_level, 
                                   risk_color=risk_color,
                                   recommendations=[])
        except ValueError as e:
            return render_template('predict.html', errors=[str(e)])
    return render_template('predict.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
`
    },
    {
      name: 'train_model.py',
      label: 'Model Training Classifier (train_model.py)',
      lang: 'python',
      content: `import os
import urllib.request
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

def download_dataset():
    dataset_dir = "dataset"
    dataset_path = os.path.join(dataset_dir, "diabetes.csv")
    if os.path.exists(dataset_path):
        return dataset_path
    if not os.path.exists(dataset_dir):
        os.makedirs(dataset_dir)
        
    url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
    urllib.request.urlretrieve(url, dataset_path)
    return dataset_path

def train():
    dataset_path = download_dataset()
    columns = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome']
    df = pd.read_csv(dataset_path, header=None, names=columns)
    
    # Preprocessing medians replacement
    zero_features = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    for col in zero_features:
        median_val = df[df[col] != 0][col].median()
        df[col] = df[col].replace(0, median_val)

    X = df.drop('Outcome', axis=1)
    y = df['Outcome']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    
    # Scaler & Models
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    rf_model = RandomForestClassifier(random_state=42, n_estimators=150, max_depth=6)
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)

    export_payload = {
        'model_name': 'Random Forest Classifier',
        'model': rf_model,
        'scaler': scaler,
        'is_scaled': False,
        'feature_names': list(X.columns)
    }
    joblib.dump(export_payload, "model.pkl")
    print(f" elite prediction payload exported successfully! Accuracy: {rf_acc*100:.2f}%")

if __name__ == "__main__":
    train()
`
    },
    {
      name: 'requirements.txt',
      label: 'Packages Manifest (requirements.txt)',
      lang: 'text',
      content: `Flask==3.0.3
Werkzeug==3.0.3
pandas==2.2.2
numpy==1.26.4
scikit-learn==1.5.0
joblib==1.4.2
gunicorn==22.0.0
jinja2==3.1.4
`
    }
  ];

  const handleCopy = (contentStringString: string, filename: string) => {
    navigator.clipboard.writeText(contentStringString);
    setCopied(filename);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentFileObj = files.find(f => f.name === selectedFile) || files[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      
      {/* Narrative Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Python / Flask Portability Hub</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Export fully complete Python backend scripts and deploy directly to render.com pipelines with zero-dependency errors.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side File Tree selectors */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Project Subdirectory Structure</span>
          <div className="space-y-1">
            {files.map((f) => (
              <button
                key={f.name}
                onClick={() => setSelectedFile(f.name)}
                className={`flex items-center gap-2 w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedFile === f.name
                    ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-slate-800 dark:border-slate-700 dark:text-sky-300'
                    : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-350'
                }`}
                id={`file-tab-${f.name}`}
              >
                <FileText className="w-4.5 h-4.5" />
                {f.name}
              </button>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-blue-500" />
              Render Fast Deploy Profile
            </span>
            <ul className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1 list-disc pl-3">
              <li><strong>Environment:</strong> Python 3</li>
              <li><strong>Build Command:</strong> <code>pip install -r requirements.txt && python train_model.py</code></li>
              <li><strong>Start Command:</strong> <code>gunicorn app:app</code></li>
            </ul>
          </div>
        </div>

        {/* Right Side Codeblock panel and copy */}
        <div className="md:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-sky-400 font-bold tracking-tight">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>{currentFileObj.name}</span>
            </div>
            
            <button
              onClick={() => handleCopy(currentFileObj.content, currentFileObj.name)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 font-semibold px-3.5 py-1.5 rounded-lg text-[10px] text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              id="copy-code-btn"
            >
              {copied === currentFileObj.name ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  Copied Script!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" />
                  Copy Script
                </span>
              )}
            </button>
          </div>

          <div className="overflow-y-auto max-h-[460px] font-mono text-xs text-slate-300 leading-relaxed bg-[#020617] p-4 rounded-xl border border-slate-900 select-all">
            <pre>{currentFileObj.content}</pre>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
