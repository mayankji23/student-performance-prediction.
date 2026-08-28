# student-performance-prediction.
Machine learning project for predicting students academic performance
# 🧠 Project: SYNAPSE
## AI Student Performance Forecaster

An interactive browser-based application that uses a neural network to predict student academic performance from study and academic parameters.

The system also provides subject-wise analysis, personalized study recommendations, analytics visualization, and an AI Study Tutor interface.

---

## ✨ Features

- 🧠 Neural-network-based student performance prediction
- 📊 Student performance analytics dashboard
- 📚 Subject-wise performance analysis
- 📝 Personalized AI-generated study recommendations
- 📈 Interactive performance visualization
- 🎙️ Read-aloud support for study recommendations
- 🤖 AI Study Tutor with Wikipedia knowledge-base integration
- 💻 Modern responsive dashboard interface
- 🌐 Runs directly in a web browser

---

## 🧠 Machine Learning Approach

The application generates a synthetic dataset of **300 student records** and uses this data to train a neural network directly in the browser.

The model considers six parameters:

- Study hours per week
- Attendance percentage
- CGPA
- Mathematics marks
- Science marks
- English marks

The input values are normalized before being passed to the neural network.

### Neural Network Architecture

```text
Student Parameters
       ↓
Input Layer
       ↓
Hidden Layer — 6 neurons
       ↓
Hidden Layer — 4 neurons
       ↓
Output Layer
       ↓
Predicted Performance Score

The neural network is implemented using Brain.js with sigmoid activation.
Training Configuration
.Training records: 300
.Hidden layers: [6, 4]
.Activation: Sigmoid
.Maximum iterations: 2000
.Error threshold: 0.005
.Learning rate: 0.1

🔄 System Workflow
Student Information
        ↓
Input Validation
        ↓
Data Normalization
        ↓
Synthetic Dataset Generation
        ↓
Neural Network Training
        ↓
Performance Prediction
        ↓
Subject Analysis
        ↓
Personalized Study Plan
        ↓
Analytics Visualization

---

## 📋 Input Parameters

| Parameter | Range |
|---|---|
| Study Hours | 0–40 hours/week |
| Attendance | 0–100% |
| CGPA | 0–10 |
| Mathematics | 0–100 |
| Science | 0–100 |
| English | 0–100 |

---

## 🎯 Application Highlights

### Student Profiler

Users can enter their:

- Study hours
- Attendance
- CGPA
- Mathematics marks
- Science marks
- English marks

### AI Prediction Matrix

The trained neural network generates a predicted performance score based on the supplied parameters.

### Personalized Study Plan

The application analyzes the student's subject performance and generates actionable recommendations to help improve their academic performance.

### Analytics Dashboard

The dashboard visualizes the student's performance and compares selected parameters with statistics generated from the training data.

### AI Study Tutor

The application includes an interactive study assistant that retrieves factual information using the Wikipedia API.

### Voice Support

The study recommendations can be read aloud using the browser's Web Speech API.

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Brain.js
- Chart.js
- Font Awesome
- Web Speech API
- Wikipedia API
- Google Fonts

---

## 📸 Screenshots

### Project SYNAPSE

The application begins with a dedicated splash screen introducing the AI Student Performance Forecaster.

### Student Performance Dashboard

The dashboard provides student profiling, performance prediction, study recommendations, and analytics.

### AI Prediction & Study Plan

The prediction interface displays the estimated performance score along with personalized recommendations.

---

## 💻 How to Run

### Option 1 — Open Directly

1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` in a modern web browser.
4. Click **Enter Neural Network**.
5. Initialize the dataset and train the model.
6. Enter student parameters.
7. Generate the performance prediction.

### Option 2 — Using VS Code

1. Clone the repository.
2. Open the project folder in Visual Studio Code.
3. Install the **Live Server** extension if required.
4. Right-click `index.html`.
5. Select **Open with Live Server**.

---

## ⚠️ Dataset Disclaimer

This project currently uses a **synthetically generated dataset** rather than a real-world student dataset.

The application generates 300 student records programmatically for demonstrating the machine-learning workflow.

Therefore, the prediction system should be considered a **prototype/educational demonstration** and not a scientifically validated academic assessment tool.

---

## 🔮 Future Improvements

- Integrate a real-world student performance dataset
- Add proper training and testing dataset separation
- Compare multiple machine-learning algorithms
- Add model evaluation metrics such as MAE, MSE, and R²
- Improve model validation and generalization
- Add persistent model storage
- Deploy the application online
- Add student accounts and prediction history
- Expand the AI Study Tutor
- Add more academic and behavioral parameters

---

## 📌 Project Status

**Completed Prototype**

This project demonstrates an end-to-end browser-based machine-learning workflow for student performance forecasting.

---

## 👨‍💻 Author

**Mayank Pandey**

Computer Science Student | AI/ML Enthusiast
