<?php
session_start();
if (!isset($_SESSION['Patient_ID'])) {
    http_response_code(401);
    die("Unauthorized access. Please log in.");
}

$PatientID = $_SESSION['Patient_ID'];
$diagnosis = filter_input(INPUT_POST, 'diagnosis', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$Request = filter_input(INPUT_POST, 'request', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$otherRequest = filter_input(INPUT_POST, 'otherRequest', FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?? '';
$natureOfRequest = $Request . (in_array($Request, ['Others', 'Medicine', 'Laboratory/Diagnostic Procedures', 'Transplant'], true) ? ' - ' . $otherRequest : '');
$conn = new mysqli("localhost", "root", "", "IMAPForm");
if ($conn->connect_error) {
    http_response_code(500);
    die('Database Connection Error');
}

$stmt = $conn->prepare("INSERT INTO application_information (Patient_ID, Patient_Diagnosis, Patient_NatureOfRequest) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $PatientID, $diagnosis, $natureOfRequest);

if ($stmt->execute()) {
    echo "SUCCESS";
} else {
    http_response_code(500);
    echo "DATABASE_WRITE_ERROR";
}
$stmt->close();
$conn->close();
?>