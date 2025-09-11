document.addEventListener("DOMContentLoaded", function () {
  // --- ACTION: Replaced the placeholder with your actual Firebase configuration ---
  const firebaseConfig = {
    apiKey: "AIzaSyBfvHLNMJK-mbuaZxrmE_xR-cRqnBEi9Sw",
    authDomain: "smart-attendance-3d7b9.firebaseapp.com",
    projectId: "smart-attendance-3d7b9",
    storageBucket: "smart-attendance-3d7b9.firebasestorage.app",
    messagingSenderId: "441331109876",
    appId: "1:441331109876:web:8a56061a4559168fd9f3a1",
    measurementId: "G-JPHEQWNXSX"
  };

  // --- Initialize Firebase and Firestore ---
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();

  // Sign in anonymously to get secure access to the database.
  auth.signInAnonymously().catch((error) => {
    console.error("Error signing in anonymously:", error);
    displayResult([], "Error: Could not connect to the database.");
  });

  // Listen for authentication state changes.
  auth.onAuthStateChanged((user) => {
    if (user) {
      // If the user is signed in, set up the real-time listener.
      console.log("Firebase user signed in:", user.uid);
      setupRealtimeListener();
    } else {
      console.log("User is signed out.");
    }
  });


  // --- Event listeners for the main action buttons ---
  const buttons = document.querySelectorAll(".buttons button");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const method = this.textContent.trim();
      if (method === "Turn On Camera") {
        runLiveFaceRecognition();
      } else if (method === "Upload an Image(s)") {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.multiple = true;
        fileInput.addEventListener("change", function (event) {
          const selectedFiles = event.target.files;
          if (selectedFiles.length > 0) {
            runImageFaceRecognition(selectedFiles);
          }
        });
        fileInput.click();
      }
    });
  });


  // --- Real-Time Listener Function ---
  function setupRealtimeListener() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    db.collection("attendance")
      .where("timestamp", ">=", startOfToday)
      .orderBy("timestamp", "desc")
      .onSnapshot(
        (querySnapshot) => {
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
        },
        (error) => {
          console.error("Error fetching real-time data: ", error);
          displayResult([], "Error: Could not fetch attendance data.");
        }
      );
  }


  // --- Functions to Trigger Backend Processes ---
  function runLiveFaceRecognition() {
    displayResult(null, "Live camera is active. Press 'Esc' in the camera window to finish.");
    fetch("http://localhost:5000/run_live_face_recognition", {
      method: "POST",
    })
      .then(response => response.json())
      .then(data => console.log("Live recognition process triggered:", data))
      .catch((error) => {
        console.error("Error starting live recognition:", error);
        displayResult([], "Error: Could not start live camera.");
      });
  }

  function runImageFaceRecognition(imageFiles) {
    const formData = new FormData();
    for (const file of imageFiles) {
      formData.append("images[]", file);
    }

    displayResult(null, "Processing Image(s)...");

    fetch("http://localhost:5000/run_image_face_recognition", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(data => console.log("Image recognition triggered:", data))
      .catch((error) => {
        console.error("Error during image recognition:", error);
        displayResult([], "Error during recognition.");
      });
  }


  // --- Display Function ---
  function displayResult(results, title) {
    const resultsContainer = document.querySelector(".results");
    resultsContainer.innerHTML = "";

    const titleElement = document.createElement("h3");
    titleElement.textContent = title;
    resultsContainer.appendChild(titleElement);

    if (results === null) return; // Loading state

    if (!results || results.length === 0) {
      const noResultItem = document.createElement("div");
      noResultItem.textContent = "No students have been marked present yet.";
      resultsContainer.appendChild(noResultItem);
      return;
    }

    results.forEach((result, index) => {
      const listItem = document.createElement("div");
      listItem.textContent = `${index + 1}) ${result}`;
      resultsContainer.appendChild(listItem);
    });
  }
});

