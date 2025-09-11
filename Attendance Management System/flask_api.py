from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

@app.route('/run_live_face_recognition', methods=['POST'])
def run_live_face_recognition():
    """
    Endpoint to trigger the live face recognition script.
    """
    try:
        # Run the live_face_recognition_attendance.py script using subprocess
        subprocess.run(['python', 'live_face_recognition_attendance.py'])
        return jsonify({'status': 'success', 'message': 'Live recognition process completed.'})
    except Exception as e:
        return jsonify({'status': 'error', 'error_message': str(e)})

@app.route('/run_image_face_recognition', methods=['POST'])
def run_image_face_recognition():
    """
    Endpoint to handle image uploads and trigger the image recognition script.
    """
    try:
        if 'images[]' not in request.files:
            return jsonify({'status': 'error', 'error_message': 'No image files provided'})

        image_files = request.files.getlist('images[]')
        
        # Create a temporary directory to store uploaded images if it doesn't exist
        temp_dir = 'temp_uploads'
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)

        image_paths = []
        for image_file in image_files:
            # Save each uploaded image temporarily
            image_path = os.path.join(temp_dir, image_file.filename)
            image_file.save(image_path)
            image_paths.append(image_path)
        
        # Run the image recognition script for each uploaded image
        for path in image_paths:
            subprocess.run(['python', 'image_face_recognition_attendance.py', path])
            os.remove(path) # Clean up the temporary file

        return jsonify({'status': 'success', 'message': 'Image recognition process completed.'})
    except Exception as e:
        return jsonify({'status': 'error', 'error_message': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

