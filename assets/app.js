// Initialize Firebase
var config = {
    apiKey: "AIzaSyDqYySap90j0XmwEmnpMRyws1E0JfYIJvc",
    authDomain: "train-times-5723f.firebaseapp.com",
    databaseURL: "https://train-times-5723f.firebaseio.com",
    projectId: "train-times-5723f",
    storageBucket: "",
    messagingSenderId: "571229280260"
  };

firebase.initializeApp(config);
var database = firebase.database();

// Function for displaying current time.
function displayCurrentTime() {

    setInterval(function() {
        var now = moment().format("dddd, MMMM Do, YYYY, h:mm:ss a");
        $("#current-time").text(now);
    }, 1000);
    
};

// Execute callback when new child added to Firebase.
setInterval(function() {

    $("tbody").empty();
    
    database.ref().on("child_added", function(snapshot) {

    // Cahce reference to the snapshot value.
    var sv = snapshot.val();

    // Create new row.
    var newRow = $("<tr>");

    // Calculate next arrival
    var firstTimeConverted = moment(sv.firstTrain, "HH:mm A").subtract(1, "years");
    var current = moment();
    var diffTime = current.diff(firstTimeConverted, "minutes");
    var timeApart = diffTime % sv.frequency;
    var minutesTillTrain = sv.frequency - timeApart;
    var nextTrain = current.add(minutesTillTrain, "minutes"); 

    // Create new table data entries with appropriate values.
    var originTD = $("<td>").text(sv.origin);
    var destinationTD = $("<td>").text(sv.destination);
    var frequencyTD = $("<td>").text(sv.frequency);
    var nextArrivalTD = $("<td class='next-arrival'>").text(nextTrain.format("h:mm A"));
    var minutesAwayTD = $("<td class='minutes-away'>").text(minutesTillTrain);
    
    // Append td values to row.
    newRow.append(originTD, destinationTD, frequencyTD, nextArrivalTD, minutesAwayTD);
    
    // Append new row to existing table "tbody".
    $("tbody").append(newRow);

});

}, 1000);

// On click event handler for form submit.
$("#submit").on("click", function (e) {

    e.preventDefault();

    // Grab values from submit button.
    origin = $("#origin-name").val().trim();
    destination = $("#destination-name").val().trim();
    frequency = parseInt($("#frequency").val().trim());
    firstTrain = $("#first-train").val().trim();
    
    // Push new entry to Firebase.
    database.ref().push({
        origin: origin,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    });

    // Clear entered text from input field upon submission.
    $("#origin-name").val("");
    $("#destination-name").val("");
    $("#frequency").val("");
    $("#first-train").val("");

});

displayCurrentTime();