radio.setGroup(15)
let odpovedi = [ {
    "serial" : 156840,
    "vote" : 0,
}
]
_py.py_array_pop(odpovedi)
let muzehlasovat = true
let zmeneno = false
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    let zmeneno: boolean;
    let serial_num: number;
    let counter: number;
    
    if (name == "answer" && muzehlasovat) {
        zmeneno = false
        serial_num = radio.receivedPacket(RadioPacketProperty.SerialNumber)
        counter = -1
        for (let o of odpovedi) {
            counter += 1
            if (o["serial"] == serial_num) {
                odpovedi[counter]["vote"] = value
                zmeneno = true
            }
            
        }
        if (!zmeneno) {
            odpovedi.push( {
                "serial" : serial_num,
                "vote" : value,
            }
            )
        }
        
        radio.sendValue("prijat", serial_num)
    }
    
})
// klient může  znova odpovídat
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (muzehlasovat) {
        muzehlasovat = false
        radio.sendNumber(0)
    } else {
        muzehlasovat = true
        radio.sendNumber(1)
    }
    
})
// zobrazování odpovědí
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    let pocet: number;
    
    for (let i = 0; i < 5; i++) {
        pocet = 0
        for (let p of odpovedi) {
            if (p["vote"] == i) {
                pocet += 1
            }
            
        }
        console.log(String.fromCharCode(i + 65) + ": " + pocet)
        basic.showString(String.fromCharCode(i + 65) + ":" + pocet, 50)
    }
})
input.onLogoEvent(TouchButtonEvent.Pressed, function on_logo_event_pressed() {
    
    for (let i = 0; i < odpovedi.length; i++) {
        odpovedi.removeAt(i)
    }
})
