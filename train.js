// click submit
$("#submitButton").on("click", function () {
    event.preventDefault();
    // variables for form inputs

    var trainName = $("#inputName").val();
    $("#inputName").val("");

    var trainDestination = $("#inputDestination").val();
    $("#inputDestination").val("");

    var firstTrainTime = $("#inputTrainTime").val();
    console.log(firstTrainTime);
    $("#inputTrainTime").val("");

    // var nextArrival = 

    var trainFrequency = $("#inputFrequency").val();
    $("#inputFrequency").val("");

    var newTrain = {
        name: trainName,
        destination: trainDestination,
        firstTrainTime: moment(firstTrainTime, "HH:mm").format("X"),
        trainFrequency: trainFrequency
    };

    pushToFirebase(newTrain)
});

// click submit, form inputs append to schedule

function createTableRow(newTrain) {
    var newTableRow = $('<tr>').addClass('tr-hover');
    var trainNameData = $('<td>').text(newTrain.name);
    var trainDestinationData = $('<td>').text(newTrain.destination);
    var trainFrequencyData = $('<td>').text(newTrain.trainFrequency);
    var nextArrivalData = $("<td>")
    var minAwayData = $("<td>")

    var trainInit = moment(newTrain.firstTrainTime, "X")
    var minAway;
    var nextArrival;

    var timeDiff = moment().diff(trainInit, "minutes")

    var maxMoment = moment.max(moment(), trainInit)

    if(maxMoment === trainInit){
        minAway = Math.abs(timeDiff);
        nextArrival = trainInit.format("hh:mm A")
    } else {
        var remainder = Math.abs(timeDiff) % newTrain.trainFrequency
        minAway = newTrain.trainFrequency - remainder
        nextArrival = moment().add(minAway, "minutes").format("hh:mm A")
    }

    minAwayData.text(minAway)
    nextArrivalData.text(nextArrival)

    newTableRow.append(trainNameData, trainDestinationData, trainFrequencyData, nextArrivalData, minAwayData);
    $("#trainList").append(newTableRow);
}

function pushToFirebase(newTrain){
    database.ref().push(newTrain);
};

database.ref().on("child_added", function (newTrain){
    createTableRow(newTrain.val());
});