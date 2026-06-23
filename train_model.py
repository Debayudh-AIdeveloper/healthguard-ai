import os
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
    """
    Downloads Pima Indians Diabetes Dataset from a reliable repository if not present locally
    """
    dataset_dir = "dataset"
    dataset_path = os.path.join(dataset_dir, "diabetes.csv")
    
    if os.path.exists(dataset_path):
        print(f"[HealthGuard System] Local dataset found at '{dataset_path}'")
        return dataset_path
    
    if not os.path.exists(dataset_dir):
        os.makedirs(dataset_dir)
        
    url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
    print(f"[HealthGuard System] Local dataset not found. Downloading archive from: {url}")
    try:
        urllib.request.urlretrieve(url, dataset_path)
        print(f"[HealthGuard System] Download complete. Dataset saved to '{dataset_path}'")
    except Exception as e:
        print(f"[HealthGuard System] Download failed ({e}). Generating synthetic representative dataset to ensure fallback execution...")
        # Fallback synthetic generator keeping statistical correlations
        np.random.seed(42)
        n_samples = 768
        data = {
            'Pregnancies': np.random.randint(0, 15, n_samples),
            'Glucose': np.random.randint(44, 199, n_samples),
            'BloodPressure': np.random.randint(24, 122, n_samples),
            'SkinThickness': np.random.randint(0, 99, n_samples),
            'Insulin': np.random.randint(0, 846, n_samples),
            'BMI': np.random.uniform(18.0, 67.1, n_samples),
            'DiabetesPedigreeFunction': np.random.uniform(0.078, 2.42, n_samples),
            'Age': np.random.randint(21, 81, n_samples),
            'Outcome': np.zeros(n_samples, dtype=int)
        }
        # Inject correlation for diabetic outcome (glucose, BMI, age)
        for i in range(n_samples):
            score = (data['Glucose'][i] * 0.04) + (data['BMI'][i] * 0.1) + (data['Age'][i] * 0.02)
            if score > 8.5 + np.random.normal(0, 1.5):
                data['Outcome'][i] = 1
                
        df = pd.DataFrame(data)
        df.to_csv(dataset_path, index=False, header=False)
        print(f"[HealthGuard System] Synthetic fallback dataset generated at '{dataset_path}'")
        
    return dataset_path

def train():
    # 1. Acquire and parse dataset
    dataset_path = download_dataset()
    
    # Column naming convention for the Pima Indians diabetes dataset
    columns = [
        'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
        'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome'
    ]
    
    # Read the dataset (handle with or without headers)
    df = pd.read_csv(dataset_path, header=None)
    if df.shape[1] == 9:
        # Check if first row is headers or numbers
        try:
            float(df.iloc[0, 0])
            df.columns = columns
        except ValueError:
            # Let's read it with header recognized
            df = pd.read_csv(dataset_path)
            df.columns = columns
    else:
        print("[Error] Dataset structure mismatch. Expected 9 columns.")
        return

    print("\n--- Dataset Summary Info ---")
    print(f"Total Records: {df.shape[0]}")
    print(f"Diabetic Cases: {df[df['Outcome'] == 1].shape[0]} (Non-diabetic: {df[df['Outcome'] == 0].shape[0]})")
    print(df.describe().loc[['mean', 'min', 'max']])

    # 2. Preprocess: Handle zeros in features where zero is biologically invalid
    # Features where zero is physically/biologically impossible:
    zero_features = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    print("\nReplacing invalid zeros with median feature values...")
    for col in zero_features:
        zero_count = (df[col] == 0).sum()
        median_val = df[df[col] != 0][col].median()
        df[col] = df[col].replace(0, median_val)
        print(f" - {col}: replaced {zero_count} zero entries with median value ({median_val:.2f})")

    # 3. Features & Target declaration
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']

    # 4. Train-Test Split (80% train, 20% test to guarantee valid verification)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # 5. Standard Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 6. Model Training & Comparison
    print("\n--- Model Training & Comparison ---")
    
    # Model A: Logistic Regression
    lr_model = LogisticRegression(random_state=42, max_iter=1000)
    lr_model.fit(X_train_scaled, y_train)
    lr_preds = lr_model.predict(X_test_scaled)
    lr_acc = accuracy_score(y_test, lr_preds)
    print(f"» Logistic Regression Validation Accuracy: {lr_acc * 100:.2f}%")

    # Model B: Random Forest
    rf_model = RandomForestClassifier(random_state=42, n_estimators=150, max_depth=6)
    rf_model.fit(X_train, y_train) # Random Forest does not strictly require scaling
    rf_preds = rf_model.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    print(f"» Random Forest Validation Accuracy    : {rf_acc * 100:.2f}%")

    # Determine, evaluate and export the best model
    best_model = None
    best_name = ""
    is_scaled = False
    
    if lr_acc >= rf_acc:
        best_model = lr_model
        best_name = "Logistic Regression"
        best_preds = lr_preds
        is_scaled = True
        best_acc = lr_acc
    else:
        best_model = rf_model
        best_name = "Random Forest"
        best_preds = rf_preds
        is_scaled = False
        best_acc = rf_acc

    print(f"\nSelecting BEST matching model: **{best_name}** ({best_acc * 100:.2f}%)")

    # 7. Final Model Evaluation Reports
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, best_preds))

    print("\nClassification Report:")
    print(classification_report(y_test, best_preds))

    # Serialize Model, Scaler and Configuration details for pipeline deployment
    export_payload = {
        'model_name': best_name,
        'model': best_model,
        'scaler': scaler if is_scaled else None,
        'is_scaled': is_scaled,
        'feature_names': list(X.columns),
        'accuracy_lr': lr_acc,
        'accuracy_rf': rf_acc,
        'intercept_': lr_model.intercept_[0] if hasattr(lr_model, 'intercept_') else None,
        'coef_': lr_model.coef_[0].tolist() if hasattr(lr_model, 'coef_') else None
    }
    
    joblib.dump(export_payload, "model.pkl")
    print("\n[HealthGuard ML Engine] Saved elite model payload directly to **model.pkl**!")

if __name__ == "__main__":
    train()
