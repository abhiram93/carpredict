
const express = require('express');
var path = require("path");
var bodyParser = require('body-parser')



var app = express();
app.set('view engine', 'ejs');


var value = new Array();


function init() {

  value['hatch'] = new Array();
  value['hatch']['price'] = 0;
  value['hatch']['maintenance'] = 0;
  value['hatch']['doors'] = 3;
  value['hatch']['persons'] = 4;
  value['hatch']['lugcap'] = 'small';
  value['hatch']['safety'] = 1;

  value['sedan'] = new Array();
  value['sedan']['price'] = 1;
  value['sedan']['maintenance'] = 1;
  value['sedan']['doors'] = 4;
  value['sedan']['persons'] = 4;
  value['sedan']['lugcap'] = 'med';
  value['sedan']['safety'] = 2;

  value['suv'] = new Array();
  value['suv']['price'] = 2;
  value['suv']['maintenance'] = 2;
  value['suv']['doors'] = 5;
  value['suv']['persons'] = 5;
  value['suv']['lugcap'] = 'big';
  value['suv']['safety'] = 3;


  value['sports'] = new Array();
  value['sports']['price'] = 3;
  value['sports']['maintenance'] = 3;
  value['sports']['doors'] = 2;
  value['sports']['persons'] = 2;
  value['sports']['lugcap'] = 'small';
  value['sports']['safety'] = 0;

  value['electric'] = new Array();
  value['electric']['price'] = 3;
  value['electric']['maintenance'] = 0;


  value['hybrid'] = new Array();
  value['hybrid']['price'] = 2;
  value['hybrid']['maintenance'] = 2;


  value['diesel'] = new Array();
  value['diesel']['price'] = 1;
  value['diesel']['maintenance'] = 3;


  value['petrol'] = new Array();
  value['petrol']['price'] = 0;
  value['petrol']['maintenance'] = 1;


  value['nobundle'] = new Array();
  value['nobundle']['price'] = 0;
  value['nobundle']['maintenance'] = 3;
  value['nobundle']['safety'] = 0;


  value['bundle1'] = new Array();
  value['bundle1']['price'] = 1;
  value['bundle1']['maintenance'] = 2;
  value['bundle1']['safety'] = 1;


  value['bundle2'] = new Array();
  value['bundle2']['price'] = 2;
  value['bundle2']['maintenance'] = 1;
  value['bundle2']['safety'] = 2;

  value['bundle3'] = new Array();
  value['bundle3']['price'] = 3;
  value['bundle3']['maintenance'] = 0;
  value['bundle3']['safety'] = 3;


  value['nonmetallic'] = new Array();
  value['nonmetallic']['price'] = 0;

  value['metallic'] = new Array();
  value['metallic']['price'] = 1;

  value['special'] = new Array();
  value['special']['price'] = 2;


  value['good'] = new Array();
  value['good']['maintenance'] = 0;

  value['bad'] = new Array();
  value['bad']['maintenance'] = 1;

  value['verybad'] = new Array();
  value['verybad']['maintenance'] = 2;

}



var decidePrice = function(safetyArray, ctype, smart, ftype, ptype, ttype) {
  //0 - 15
  var val = 0;

  if (safetyArray == undefined) {
    val = 0;
  } else {
    if (safetyArray[0] == 'abs') {
      val++;

    }

    if (safetyArray.indexOf('ebd')) {
      val++;

    }

    if (safetyArray.indexOf('tc')) {
      val++;
    }
  }

  val = val + value[ctype]['price'];

  val = val + value[smart]['price'];

  val = val + value[ftype]['price'];

  val = val + value[ptype]['price'];

  if (ttype == '1') {
    val = val + 1
  }



  if (val >= 0 && val <= 4)
    return 'low';
  else if (val >= 5 && val <= 8)
    return 'med'
  else if (val >= 9 && val <= 12)
    return 'high'
  else if (val >= 13 && val <= 15)
    return 'vhigh'

  else
    return 'invalid'

}


var decideMain = function(rdcond, ctype, ftype, ttype) {
  //0 - 9
  var val = 0;

  val = val + value[rdcond]['maintenance'];

  val = val +  value[ctype]['maintenance'] ;

    val = val +  value[ftype]['maintenance'] ;

    if (ttype == '1') {
      val = val + 1
    }

  if (val >= 0 && val <= 2)
    return 'low';
  else if (val >= 3 && val <= 5)
    return 'med'
  else if (val >= 6 && val <= 7)
    return 'high'
  else if (val >= 8 && val <= 9)
    return 'vhigh'

  else
    return 'invalid'

}

var decideDoors = function(ctype) {
  return value[ctype]['doors']
}

var decidePerson = function(ctype) {
  return value[ctype]['persons']
}

var decideLuggage = function(ctype) {
  return value[ctype]['lugcap']
}

var decideSafety = function(safetyArray, ctype, smart) {
  //0-9

  var val = 0;

  if (safetyArray == undefined) {
    val = 0;
  } else {
    if (safetyArray[0] == 'abs') {
      val++;

    }

    if (safetyArray.indexOf('ebd')) {
      val++;

    }

    if (safetyArray.indexOf('tc')) {
      val++;
    }
  }

  val = val +  value[ctype]['safety'] ;


  val = val +  value[smart]['safety'] ;


  if (val >= 0 && val <= 2)
    return 'low';
  else if (val >= 3 && val <= 6)
    return 'med'
  else if (val >= 7 && val <= 9)
    return 'high'
}

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {


  //res.sendFile(__dirname + '/index.html');
  res.render('index')
});


app.post('/test', function(req, res) {



  var ctype = req.body.ctype;
  var ftype = req.body.ftype;
  var ttype = req.body.ttype;
  var safety = req.body.safety;

  var smart = req.body.smartf;
  var ptype = req.body.ptype;

  var rdcond = req.body.rdcond;


  var door= decideDoors(ctype);
  var persons = decidePerson(ctype);
  var lugg = decideLuggage(ctype);
  var price = decidePrice(safety, ctype, smart, ftype, ptype, ttype);
  var maint = decideMain(rdcond, ctype, ftype, ttype);
  var safety = decideSafety(safety, ctype, smart);


 getValueFromML(door, persons, lugg, price, maint, safety, function (data) {

   result = JSON.stringify(data);
            parsedResult = JSON.parse(result);


            var obj = [0 ,0,0 ,0,0];

              obj[0] = parsedResult.Prediction.predictedLabel;

                if(obj[0] == 'unacc') {
                  obj[0] = 'Unacceptable'
                }

                if(obj[0] == 'acc') {
                  obj[0] = 'Acceptable'
                }

                if(obj[0] == 'good') {
                  obj[0] = 'Good'
                }

                if(obj[0] == 'vgood') {
                  obj[0] = 'Very good'
                }

              obj[1] = parsedResult.Prediction.predictedScores.acc.toFixed(2);;

              obj[2] = parsedResult.Prediction.predictedScores.unacc.toFixed(2);;

              obj[3] = parsedResult.Prediction.predictedScores.good.toFixed(2);;

              obj[4] = parsedResult.Prediction.predictedScores.vgood.toFixed(2);






   res.render('predict', {
     obj:obj
   });
 });




});




var getValueFromML = function(door, persons, lugg, price, maint, safety , callback) {

  var AWS = require('aws-sdk');
  AWS.config.update({
  //  accessKeyId: "AKIAIWAOZMRO4QA7FZSQ",
    accessKeyId: "AKIAJP4VG2GNWPLEMCEQ",
  //  secretAccessKey: "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",
    secretAccessKey: "AWTJ0rICt4WxMK50/G3uW4oNedb5jgTaO/bWldZ4",
    "region": "eu-west-1" //  <- If you want send something to your bucket, you need take off this settings, because the S3 are global.
  });

  //  AWS.config.credentials = credentials;
  AWS.config.update({
    region: 'eu-west-1'
  });
  var machinelearning = new AWS.MachineLearning({
    apiVersion: '2014-12-12',
    region: "eu-west-1"
  });
  var params = {
    //MLModelId: 'ml-WCoGmhR6Ubp',
    MLModelId: 'ml-souiFTK3a38',
    /* required */
    //PredictEndpoint: 'https://realtime.machinelearning.eu-west-1.amazonaws.com', /* required */
    PredictEndpoint: 'https://realtime.machinelearning.eu-west-1.amazonaws.com',



    Record: {
      "Buying Price":price ,
      "Maintanance": maint,
      "doors": door+'',
      "people": persons+'',
      "luggage": lugg,
      "safety": safety
    }
  };
  machinelearning.predict(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else  {
    console.log(data); // successful response
  callback(data);


  }
  });
}




app.listen(3000, function() {
  console.log('Server Started');

  init();
  //console.log(value);
  //  test();
});
