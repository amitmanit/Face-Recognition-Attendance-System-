
# 🎯 Face Recognition Attendance System

This project is a **Face Recognition based Attendance System** that helps automate the process of marking attendance.
Instead of calling out names or using ID cards, this system uses **face recognition technology** to identify people and log their attendance automatically.

---

## 📌 About the Project

* The system is divided into two parts:

  * **Backend** → Face recognition using Python, Flask, and OpenCV.
  * **Frontend (my work)** → A simple, clean web interface using HTML, CSS, and JavaScript.
* The frontend makes it very easy for a user to capture/upload images, select date & time, and check results.

---

## ✨ Features

* 📷 Capture live images through webcam
* 🖼️ Upload images directly from system
* 📅 Select date and time filters for attendance
* ✅ Automatic attendance marking in a CSV file
* 📊 Results shown instantly on the web page
* 📱 Responsive and clean frontend design

---

## 🖥️ Frontend (My Contribution)

I built the **HTML, CSS, and JavaScript frontend** of this project.

### 🔑 What the UI Can Do

* Buttons for **Capture Image** and **Upload Image**
* Inputs for **Date, From Time, To Time**
* **Submit** button to send data to backend
* **Clear All** button to reset everything
* Results section that updates dynamically with JavaScript
* Font Awesome icons for better UX

### 🎨 Design Highlights

* Clean card-based layout
* Responsive design (works on laptop and mobile)
* Hidden inputs appear only when required → keeps interface simple
* Modern look with icons for camera, calendar, and clock

---

## 📸 Frontend Preview

Here are some screenshots of the UI I created 👇

### 🏠 1. Homepage / Dashboard

### 📷 2. Capture Image Section

### 🖼️ 3. Upload Image Section

### ⏰ 4. Date & Time Selection

### 📊 5. Results Display Section

*(Make sure to place your 5 images inside an `images/` folder in the project root and name them accordingly.)*

---

## 📂 Project Structure

```
├── Attendance.csv                        # Attendance records
├── flask_api.py                          # Backend Flask API
├── live_face_recognition_attendance.py   # Live webcam recognition
├── image_face_recognition_attendance_1.py# Image-based recognition
├── Image_generation.ipynb                # Notebook for extra image processing
├── index.html                            # Frontend (my work)
├── styles.css                            # Frontend styling (my work)
├── script.js                             # Frontend logic (my work)
└── README.md                             # Documentation
```

---

## ⚙️ How to Run

1. Clone the repository

   ```bash
   git clone https://github.com/amitmanit/Face-Recognition-Attendance-System-.git
   cd Face-Recognition-Attendance-System-
   ```

2. Install Python dependencies

   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend server

   ```bash
   python flask_api.py
   ```

4. Open `index.html` in your browser to use the frontend.

---

## 🛠️ Tech Stack

**Frontend (my contribution):**

* HTML
* CSS
* JavaScript
* Font Awesome

**Backend:**

* Python
* Flask
* OpenCV
* face\_recognition / dlib
* CSV

---

## 🙌 Contribution

* My contribution: **Frontend development (HTML, CSS, JavaScript UI)**
* Backend: Provided as part of the project (face recognition + attendance logic).
* Future improvements: Database integration, detailed analytics, and advanced UI.

---


Kya tum chahte ho mai tumhe ek **ready-made `images/` folder structure** aur sample placeholder images banake de du, taaki bas replace karna ho?
