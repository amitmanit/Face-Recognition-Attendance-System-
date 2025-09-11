import cv2
import face_recognition
import os
import sys
from firebase_config import mark_attendance # NEW: Import the Firebase function

def find_encodings(images):
    encode_list = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encode_list.append(encode)
    return encode_list

# REMOVED: The old CSV-based mark_attendance function is gone.

def recognize_faces(image_path, known_encodings, known_names):
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read image from path: {image_path}")
        return

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    faces_cur_frame = face_recognition.face_locations(img_rgb)
    encodes_cur_frame = face_recognition.face_encodings(img_rgb, faces_cur_frame)

    for encode_face, face_loc in zip(encodes_cur_frame, faces_cur_frame):
        matches = face_recognition.compare_faces(known_encodings, encode_face)
        face_dis = face_recognition.face_distance(known_encodings, encode_face)
        
        if len(face_dis) == 0:
            continue
            
        match_index = min(range(len(face_dis)), key=face_dis.__getitem__)

        if matches[match_index]:
            name = known_names[match_index].upper()
            
            # Use the new Firebase function to mark attendance
            mark_attendance(name)

            y1, x2, y2, x1 = face_loc
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
            cv2.putText(img, name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

    # You can optionally show the image with recognized faces
    # cv2.imshow('Recognized Faces', img)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    print(f"Finished processing image: {image_path}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python image_face_recognition_attendance.py <image_path>")
        sys.exit(1)

    image_to_process = sys.argv[1]
    
    path = 'Training_images'
    images = []
    classNames = []
    myList = os.listdir(path)
    for cl in myList:
        curImg = cv2.imread(f'{path}/{cl}')
        if curImg is not None:
            images.append(curImg)
            classNames.append(os.path.splitext(cl)[0])

    if not images:
        print("No training images found. Exiting.")
        sys.exit(1)

    known_encodings = find_encodings(images)
    print("Encoding of known faces complete.")
    
    recognize_faces(image_to_process, known_encodings, classNames)
