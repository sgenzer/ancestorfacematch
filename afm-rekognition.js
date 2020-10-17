// Ancestor Face Match - Public Beta 0.2.001 - August 2020
// Author Scott Genzer
// All content is free to be used and distributed by anyone who wishes under the GNU General Public License v3.0
// Attribution kindly requested.

// calls Rekognition API
function SearchFacesByImage(collectionValue, imageData, callback) {
  AWS.region = "us-east-1";
  var rekognition = new AWS.Rekognition();
  var params = {
    CollectionId : collectionValue,
    FaceMatchThreshold: 90,
    Image : {
      Bytes : imageData
    },
    MaxFaces: 15
  };
  rekognition.searchFacesByImage(params, function (err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      document.getElementById("opResult").innerHTML = "Hmm an error occurred. Try again?";
    } else if (data.FaceMatches.length == 0) {
      document.getElementById("opResult").innerHTML = "No results found.";
    } else {
      var table = tableMaker(data, collectionValue);
      document.getElementById("opResult").innerHTML = table;
    }
  }
);
}

// loads selected image and unencodes image bytes for Rekognition DetectFaces API
function ProcessImage() {
  AnonLog();
  var control = document.getElementById("fileToUpload");
  var collectionName = document.getElementById("collection").value;
  var file = control.files[0];

  // Load base64 encoded image
  var reader = new FileReader();
  reader.onload = (function (theFile) {
    return function (e) {
      var img = document.createElement('img');
      var image = null;
      img.src = e.target.result;
      var jpg = true;
      try {
        image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);

      } catch (e) {
        jpg = false;
      }
      if (jpg == false) {
        try {
          image = atob(e.target.result.split("data:image/png;base64,")[1]);
        } catch (e) {
          alert("Not an image file Rekognition can process");
          return;
        }
      }
      //unencode image bytes for Rekognition DetectFaces API
      var length = image.length;
      imageBytes = new ArrayBuffer(length);
      var ua = new Uint8Array(imageBytes);
      for (var i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i);
      }
      //Call Rekognition
      console.log("collection is " + collectionName);
      SearchFacesByImage(collectionName,imageBytes);
    };
  })(file);
  reader.readAsDataURL(file);
}

// provides anonymous log on to AWS services
function AnonLog() {
  // Configure the credentials provider to use your identity pool
  AWS.config.region = 'us-east-1'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-xxxxxxx',
  });
  // Make the call to obtain credentials
  AWS.config.credentials.get(function () {
    // Credentials will be available when this function is called.
    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;
  });
}

// adds a jpg file extension if there is no extension present
function fileNameFixer(string) {
  var ending = string.endsWith("png");
  if(ending) return string;
  else {
    var newString = string + '.jpg';
    return newString;
  }
}

// constructs the results table
function tableMaker(data, collection) {
  var table = "<table class=\"resultsTable\"><tr><th>External File Name</th><th>Similarity</th><th>Image (click to enlarge)</th></tr>";
  for (var i = 0; i < data.FaceMatches.length; i++) {
    table += '<tr><td width="30%">' +
    fileNameFixer(data.FaceMatches[i].Face.ExternalImageId) +
    '</td><td>' +
    data.FaceMatches[i].Similarity.toFixed(2) +
    '%</td><td><a href="https://' + collection + '.s3.amazonaws.com/' +
    fileNameFixer(data.FaceMatches[i].Face.ExternalImageId) + '" data-lightbox="resultImage"><img src="https://' + collection + '.s3.amazonaws.com/' +
    fileNameFixer(data.FaceMatches[i].Face.ExternalImageId) + '"></a></td></tr>';
  }
  table += "</table>";
  return table;
}

// gives preview of image
function importFileandPreview() {
  var preview = document.querySelector('img');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}
