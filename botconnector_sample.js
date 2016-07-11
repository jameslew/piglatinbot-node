
/*-----------------------------------------------------------------------------
A simple "Hello World" bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/
var restify = require('restify');
var builder = require('botbuilder');
var unicodelib = require('unicode-properties');

//=========================================================
// Bot Setup
//=========================================================

// Create bot and setup server
var connector = new builder.ChatConnector({
   appId: '7dbef12d-aae2-4432-bef3-f5f1310d995e',
   appPassword: 'jawjfNhLgiOsSufmW5fm2gW' 
});
var bot = new builder.UniversalBot(connector);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', connector.verifyBotFramework(), connector.listen());
//server.listen(process.env.port || 3798, function () {
server.listen( 3798, function () {
   console.log('%s listening to %s', server.name, server.url);
});

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/', function (session) {
    
    replyMessage = new builder.Message(session);
    replyMessage.textFormat("plain");
    
    if (session.message.text=="MessageTypesTest") {
        var reply = session.send(messageTypesTest(session));
    }
    else if (session.message.text=="DataTypesTest") {
        //Activity dtResult = await dataTypesTest(message, connector);
        var reply = session.send(replyMessage);
    }
    else if (session.message.text=="CardTypesTest") {
        //Activity ctResult = await cardTypesTest(message, connector);
        var reply = session.send(replyMessage);
    }
        
    replyMessage.text(translateToPigLatin(session.message.text));
    session.send(replyMessage);
});

function messageTypesTest(session) {
    var message = session.message; 
    var address = clone(message.address);
    address.conversation.delete();

    var newDirectToUser = new builder.Message(session)
        .text("Should go directly to user")
        .address(address);
    
    session.send(newDirectToUser);
    
    replyToConversation = new builder.message(session);
    replyToConversation.text("Should go back to the group or individual chat");
    
    session.send(replyToConversation);
}


function translateToPigLatin(message)
{
    var english = TrimPunctuation(message);
    var pigLatin = "";
    var firstLetter;
    var restOfWord;
    var vowels = "AEIOUaeiou";
    var letterPos;
    var outBuffer = "";
    
    english.split(" ").forEach(function(word)
    {
        if (word != "") {
            firstLetter = word.substring(0, 1);
            restOfWord = word.substring(1, word.length - 1);
            letterPos = vowels.indexOf(firstLetter);
            if (letterPos == -1) {
                //it's a consonant
                pigLatin = restOfWord + firstLetter + "ay";
            }
            else {
                //it's a vowel
                pigLatin = word + "way";
            }
            outBuffer += pigLatin + " ";
        }
    });
    return outBuffer.trim();
}

/// &llt;summary>
/// TrimPunctuation from start and end of string.
/// </summary>
function TrimPunctuation(value)
{
    // Count start punctuation.
    var removeFromStart = 0;
    for (var i = 0; i < value.length; i++) {
        if (unicodelib.isPunctuation(value[i]) || value[i] == '@') {
            removeFromStart++;
        }
        else {
            break;
        }
    }
    
    // Count end punctuation.
    var removeFromEnd = 0;
    for (var i = value.length - 1; i >= 0; i--) {
        if (unicodelib.isPunctuation(value[i])) {
            removeFromEnd++;
        }
        else {
            break;
        }
    }
    // No characters were punctuation.
    if (removeFromStart == 0 &&
                removeFromEnd == 0) {
        return value;
    }
    // All characters were punctuation.
    if (removeFromStart == value.length &&
                removeFromEnd == value.length) {
        return "";
    }
    // Substring.
    return value.substring(removeFromStart,
                value.length - removeFromEnd - removeFromStart);
}

function clone(a) {
    return JSON.parse(JSON.stringify(a));
}