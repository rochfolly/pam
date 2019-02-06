
// To install dependencies, run: npm install
const xmlbuilder = require('xmlbuilder');
const request = require('request');
const fs = require('fs');

/* If you prefer, you can hardcode your subscription key as a string and remove
   the provided conditional statement. However, we do recommend using environment
   variables to secure your subscription keys.
   For example:
   subscriptionKey = "Your-Key-Goes-Here" */
const subscriptionKey = "bf201eb6f6f540299f85133774251fd9";

/* This sample assumes your resource was created in the WEST US region. If you
   are using a different region, please update the uri. */
function textToSpeech(req) {
    let options = {
        method: 'POST',
        uri: 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issuetoken',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };
    // This function retrieve the access token and is passed as callback
    // to request below.
    function getToken(error, response, body) {
        console.log("Getting your token...\n")
        if (!error && response.statusCode == 200) {
            //This is the callback to our saveAudio function.
            // It takes a single argument, which is the returned accessToken.
            saveAudio(body, req.body.txt, req)
        }
        else {
            console.log(response.statusCode)
            throw new Error(error);
		  
        }
    }
    request(options, getToken)
}

/* Make sure to update User-Agent with the name of your resource.
   You can also change the voice and output formats. See:
   https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech */
function saveAudio(accessToken, txte, req) {
    // Create the SSML request.
    let xml_body = xmlbuilder.create('speak')
      .att('version', '1.0')
      .att('xml:lang', 'fr-FR')
      .ele('voice')
      .att('xml:lang', 'fr-FR')
      .att('name', 'Microsoft Server Speech Text to Speech Voice (fr-FR, Julie, Apollo)')
      .txt(txte)
      .end();
    // Convert the XML into a string to send in the TTS request.
    let body = xml_body.toString();
	console.log(body);
    /* This sample assumes your resource was created in the WEST US region. If you
       are using a different region, please update the uri. */
    let options = {
        method: 'POST',
        baseUrl: 'https://westus.tts.speech.microsoft.com/',
        url: 'cognitiveservices/v1',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'User-Agent': 'PAM_voix',
            'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
            'Content-Type': 'application/ssml+xml'
        },
        body: body
    };
    /* This function makes the request to convert speech to text.
       The speech is returned as the response. */
    function convertText(error, response, body){
      if (!error && response.statusCode == 200) {
        console.log("Converting text-to-speech. Please hold...\n")
      }
      else {
		console.log(response.statusCode);
		console.log(body);
        throw new Error(error);
      }
      console.log("Your file is ready.\n")
    }
    // Pipe the response to file.
    request(options, convertText).pipe(fs.createWriteStream(`src/samples/sample${req.params.question}.wav`));
}

// Runs the sample app.
exports.saveAudio = saveAudio;
exports.textToSpeech = textToSpeech;