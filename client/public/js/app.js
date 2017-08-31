var WEBSOCKET_PORT="8081";
var socket = null;
var direction ={
    front   : false,
    back    : false,
    left    : false,
    right   : false
};

/**
 * Document on Load
 */
$( document ).ready(function() {

    //connect to WebSocket
    webSocketInit();

    //Event Handlers - Key Board Shortcuts
    $('body').keydown(function(event) {
        eventHandler(event, true, null);
        event.preventDefault();
    }).keyup(function(event) {
        eventHandler(event, false, null);
        event.preventDefault();
    });

    //Event Handlers - Buttons
    $(".car_control_btn").mousedown(function(event){
        eventHandler(event, true, $(this).attr('btnDirection'));
        event.preventDefault();
    }).mouseup(function(event){
        eventHandler(event, false, $(this).attr('btnDirection'));
        event.preventDefault();
    });

    //Console dialog box initialization
    $( "#carConsole" ).dialog({
        autoOpen: true,
        width: 400,
        position: {
            my: "right-10 bottom-10",
            at: "right-10 bottom-10",
            of: window
        }
    });
});

/**
 * Web Socket Initilization
 */
function webSocketInit() {

    if (socket !== null) {
        return;
    }
    //$( "#carConsoleBody" ).append("Connecting..."  + "<br>");
    socket = new WebSocket("ws://" + document.location.hostname + ":" + WEBSOCKET_PORT);
    socket.onerror = function (evt) {
        $( "#carConsoleBody" ).append("Unable to connect to the car");
        socket.close();
        $( "#carConsoleBody" ).append("Will try again after 30 secs");
        setTimeout(function(){
            $( "#carConsoleBody" ).append("Trying to connect");
            webSocketInit();
        })
    };
    socket.onclose = function (evt) {
        socket = null;
    };
    socket.onmessage = function (event) {
        $( "#carConsoleBody" ).append("Car says \"" + event.data + "\"<br>");
    }

    //ping check whether websocket connection works
    setTimeout( function(){
        if (socket.readyState == 1) {
        //send a test msg
        socket.send("hi");
    }
    }, 100 );  // ms

}

/**
 * KeyBoard Shortcut handler
 * @param evt
 * @param down
 * @param btnDirection - Only for Button Click event. Send the Direction of the button
 */
function eventHandler(event, isPressed, btnDirection) {
    //var key = event.key || event.which || event.keyCode;

    //** Front **
    if (event.type.startsWith("key") && (event.key === "ArrowUp" || event.key === "w" || event.key === "W" || event.keyCode === 38 || event.keyCode === 87)              //keyboard shortcut Up Arrow
        || event.type.startsWith("mouse") && (btnDirection == 'front')) {  // Front
            sendUpdate('front', isPressed);
    }

    //** Back **
    else if (event.type.startsWith("key") && (event.key === "ArrowDown" || event.key === "s" || event.key === "S" || event.keyCode === 40|| event.keyCode === 83)      //keyboard shortcut Down Arrow
        || event.type.startsWith("mouse") && (btnDirection == 'back')){  // Back
            sendUpdate('back', isPressed);
    }

    //** Left **
    else if (event.type.startsWith("key") && (event.key === "ArrowLeft" || event.key === "a" || event.key === "A" || event.keyCode === 37|| event.keyCode === 65)      //keyboard shortcut Left Arrow
        || event.type.startsWith("mouse") && (btnDirection == 'left')){  // Left
            sendUpdate('left', isPressed);
    }

    //** Right **
    else if (event.type.startsWith("key") && (event.key === "ArrowRight" || event.key === "d" || event.key === "D" || event.keyCode === 39|| event.keyCode === 68)      //keyboard shortcut Right Arrow
        || event.type.startsWith("mouse") && (btnDirection == 'right')){  // Right
            sendUpdate('right', isPressed);
    }
}

/**
 * Send Update to websocket
 *
 * @param direction
 * @param down
 */
function sendUpdate(changedDirection, isPressed) {

    if(direction[changedDirection] !==isPressed){
        //sending only the delta change to reduce payload
        var payload=JSON.stringify( "{" + changedDirection + ":" + isPressed +" }"  );

        if (socket !== null) {
            socket.send(payload);
        }

        direction[changedDirection]=isPressed;  //to prevent event repeats

        //mock the button presses in UI if pressed used keyboard shortcut
        if(isPressed) {
            $(".car_control_btn[btnDirection=" + changedDirection +"]").addClass("active").attr("aria-pressed", isPressed);
        }else{
            $(".car_control_btn[btnDirection=" + changedDirection +"]").removeClass("active").attr("aria-pressed", isPressed);
        }
    }

}
