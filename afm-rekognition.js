// Ancestor Face Match - Public Beta 0.2.005 - December 2020
// Author Scott Genzer
// All content is free to be used and distributed by anyone who wishes under the GNU GPLv3 License.
// Attribution kindly requested.

// Various code snippets by Raphael Pinson (Github: raphink) kindly used with permission

//*******************
// *** BEGIN CODE ***
//*******************

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

  console.log("collectionValue is " + collectionValue);

// DOES NOT WORK
// $('#loader').show();

  rekognition.searchFacesByImage(params, function (err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      document.getElementById("opResult").innerHTML = "Hmm an error occurred. Try again?";
    } else if (collectionValue == 'afm-19cent-albums'){
      var table = tableMakerPrivate(data, collectionValue);
      document.getElementById("opResult").innerHTML = table;
    } else {
      var table = tableMakerPublic(data, collectionValue);
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

  // reject images of size >= 5MB
  if(file.size > 5242880){
       alert("File is too big (5MB max)!");
       return;
   };

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
    IdentityPoolId: 'us-east-1:297d6e43-a6cf-4548-9590-48f1e6b4af7e',
  });
  // Make the call to obtain credentials
  AWS.config.credentials.get(function () {
    // Credentials will be available when this function is called.
    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;
  });
}

// adds a jpg file extension if there is no extension present with some testing
function fileNameFixer(fileString) {
  console.log("filename string is " + fileString);
  var endingPNG = fileString.endsWith("png");
  var endingJPG = fileString.endsWith("jpg");
  console.log("endingPNG is" + endingPNG);
  console.log("endingJPG is" + endingJPG);
  if(endingPNG||endingJPG) return fileString;
  else
  {
    var newFileString = fileString + '.jpg';
    return newFileString;
  }
}

// constructs the results table for public images
function tableMakerPublic(data, collection) {
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

// constructs the results table for private images
function tableMakerPrivate(data, collection) {
  var table = "<table class=\"resultsTable\"><tr><th>External File Name</th><th>Similarity</th><th>Image (click to enlarge)</th></tr>";
  for (var i = 0; i < data.FaceMatches.length; i++) {
    table += '<tr><td width="30%">' +
    fileNameFixer(data.FaceMatches[i].Face.ExternalImageId) +
    '</td><td>' +
    data.FaceMatches[i].Similarity.toFixed(2) +
    '%</td><td>** this image is private - please contact Michele Klein to view **</td></tr>';
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
