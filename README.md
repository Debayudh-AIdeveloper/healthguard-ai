# HealthGuard AI – Health Risk Prediction System

**HealthGuard AI** is a professional, responsive, and beginner-friendly healthcare AI web application designed to predict a user's diabetes risk using machine learning and display personalized health recommendations. 

This repository contains both a high-fidelity **React + Vite / TypeScript** frontend running directly in the browser, and a complete **Python + Flask** backend ready for immediate deployment on Render.com.

---

## ⚕️ Legal & Medical Disclaimer
> **IMPORTANT NOTICE:** This application is strictly for educational purposes and portfolio demonstration. It does not formulate clinical diagnoses nor should it represent a substitute for professional medical advice, diagnostic evaluations, or treatment regimes by credentialed endocrinologists or healthcare practitioners.

---

## 🚀 Key Features

* **Advanced Predictive Engine:** Uses the Pima Indians Diabetes Dataset to evaluate risk levels (Low, Moderate, High) using logistic equations and decision thresholds.
* **Interactive Dashboard:** Complete data visualization including cohort targets distribution and ML feature coefficient weights.
* **Biomarker Explanations:** Hover cards revealing the physiological and clinical significance of each inputted parameter.
* **Integrated BMI Calculator:** Quick utility helper allowing users to automatically update BMI indices from basic height/weight ratios.
* **Actionable Recommendations:** Highly customized dietary, cardiorespiratory activity, and physician consultation suggestions mapped to precise biomarker triggers.
* **Python Portability Suite:** Integrated code view allowing developers to copy `app.py`, `train_model.py`, or `requirements.txt` scripts directly for external portfolios.

---

## 🛠️ Technology Stack

### Frontend Screen (React Platform)
* **Vite + React 19 + TypeScript** for speed and fluid state transitions.
* **Tailwind CSS 4** for adaptive, responsive utility-first styles.
* **Recharts** for clinical statistical visualizations.
* **Lucide React** for clinical outline iconography.

### Backend Python Stack (Flask Platform)
* **Flask + Werkzeug** for routing structures.
* **Scikit-learn** for Logistic Regression and Random Forest model classification.
* **Pandas & NumPy** for diagnostic statistical cleaning and zero-value replacements.
* **Joblib** for pipeline model serialization (`model.pkl`).

---

## 📂 Project Directory Structure

```text
HealthGuardAI/
├── app.py                      # Core Python Flask app routes
├── train_model.py              # ML classifier training script
├── model.pkl                   # Saved classifier payload binary
├── requirements.txt            # Python package requirements manifest
├── README.md                   # This project manual
│
├── dataset/
│   └── diabetes.csv            # Sourced Pima Indian Dataset
│
├── templates/                  # Jinja2 HTML templates
│   ├── home.html
│   ├── predict.html
│   ├── result.html
│   ├── dashboard.html
│   └── about.html
│
└── static/                     # CSS stylesheets and client script attachments
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

---

## 🏃 Local Execution Guide (Python / Flask)

### Prerequisite Setup
Ensure you have Python 3.9+ and `pip` installed on your development machine.

1. **Clone & Navigate:**
   ```bash
   git clone <your-repository-url>
   cd HealthGuardAI
   ```

2. **Virtual Environment Setup (Highly Advised):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train Model Pipeline:**
   This downloads/preprocesses the Pima Indian dataset, fits the Standard Scaler, trains classifiers, compares validate accuracies, and saves the elite model to `model.pkl`.
   ```bash
   python train_model.py
   ```

5. **Start Flask Server:**
   ```bash
   python app.py
   ```
   Open your browser to [http://localhost:5000](http://localhost:5000) to interact!

---

## ☁️ Deployment Instructions for Render.com

Deploy your Python backend directly using Render's free tier:

1. Create a free account at [render.com](https://render.com) and link your GitHub account.
2. Select **New Web Service** and select this repository.
3. Apply the following settings during service configuration:
   * **Runtime:** `Python`
   * **Branch:** `main` (or corresponding release branch)
   * **Build Command:** `pip install -r requirements.txt && python train_model.py`
   * **Start Command:** `gunicorn app:app`
4. Click **Deploy Web Service**! Render handles building your python packages, training your model, generating `model.pkl`, and serving the Flask app with high security!

---

## 🎓 Step-by-Step ML Explanation for Beginners

1. **What is a Binary Classification Problem?**
   Diabetes prediction is a binary classification because we want to predict one of two outcomes: a patient is either *diabetic* (Outcome=1) or *healthy control* (Outcome=0).

2. **Why handle Zero-Values separately?**
   In datasets, missing or uncompleted records are often written as `0`. However, a diastolic blood pressure of `0 mmHg` or a BMI of `0` is physically impossible for a living human! Our code replaces these zero-values with the *median* score of other patients to preserve training stability.

3. **Standard Scaling:**
   Features like Glucose can go up to 300, while Diabetes Pedigree Function is a tiny decimal under 2. Machine learning algorithms can get confused when these ranges are so different. We scale features so they have a mean of 0 and standard deviation of 1.

4. **Selecting the Logistic Regression vs Random Forest Model:**
   * **Logistic Regression:** Traces linear hazard coefficients matching classic epidemiology studies. Highly interpretable.
   * **Random Forest:** Builds multiple parallel Decision Trees to discover complex non-linear combinations of factors.
   Our pipeline compares both, printing training stats so you can verify and deploy the strongest model!
