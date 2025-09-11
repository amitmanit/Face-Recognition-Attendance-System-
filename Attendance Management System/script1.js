// This is the new, complete code for script1.js

document.addEventListener("DOMContentLoaded", function () {
  // --- ACTION 1: Add your Firebase project configuration here ---
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    // ... add the rest of your config details
  };

  // --- ACTION 2: Initialize Firebase ---
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();

  // Sign in anonymously for secure database access
  auth.signInAnonymously().then(() => {
    console.log("Firebase user signed in.");
    // --- ACTION 3: Set up the new real-time listener ---
    setupRealtimeListener();
  }).catch(error => {
    console.error("Firebase sign-in error:", error);
  });

  // --- Event listeners for the main action buttons (this part stays similar) ---
  const buttons = document.querySelectorAll(".buttons button");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const method = this.textContent.trim();
      if (method === "Turn On Camera") {
        runLiveFaceRecognition();
      } else if (method === "Upload an Image(s)") {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.multiple = true;
        fileInput.addEventListener("change", (event) => {
          runImageFaceRecognition(event.target.files);
        });
        fileInput.click();
      }
    });
  });

  // --- ACTION 4: The new core function ---
  function setupRealtimeListener() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    db.collection("attendance")
      .where("timestamp", ">=", startOfToday)
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        const attendanceRecords = [];
        const uniqueNames = new Set();
        querySnapshot.forEach((doc) => {
          const record = doc.data();
          if (!uniqueNames.has(record.name)) {
            uniqueNames.add(record.name);
            attendanceRecords.push(record.name);
          }
        });
        displayResult(attendanceRecords, "Today's Attendance (Live)");
      });
  }

  // --- ACTION 5: Simplify the trigger functions ---
  function runLiveFaceRecognition() {
    displayResult(null, "Live camera is active...");
    fetch("http://localhost:5000/run_live_face_recognition", { method: "POST" })
      .then(res => res.json())
      .then(data => console.log("Live recognition triggered:", data));
  }

  function runImageFaceRecognition(imageFiles) {
    const formData = new FormData();
    for (const file of imageFiles) {
      formData.append("images[]", file);
    }
    displayResult(null, "Processing Image(s)...");
    fetch("http://localhost:5000/run_image_face_recognition", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => console.log("Image recognition triggered:", data));
  }

  // The displayResult function stays mostly the same
  function displayResult(results, title) {
    const resultsContainer = document.querySelector(".results");
    resultsContainer.innerHTML = "";
    const titleElement = document.createElement("h3");
    titleElement.textContent = title;
    resultsContainer.appendChild(titleElement);
    if (results === null) return;
    if (!results || results.length === 0) {
      const item = document.createElement("div");
      item.textContent = "No students have been marked present yet.";
      resultsContainer.appendChild(item);
      return;
    }
    results.forEach((result, index) => {
      const item = document.createElement("div");
      item.textContent = `${index + 1}) ${result}`;
      resultsContainer.appendChild(item);
    });
  }
});
