radio.set_group(15)
odpovedi = [{"serial" : 156840, "vote": 0}]
odpovedi.pop()
muzehlasovat = True
zmeneno = False

radio.on_received_value(on_received_value)

def on_received_value(name, value):
    global odpovedi, muzehlasovat
    
    if name == "answer" and muzehlasovat:
        zmeneno = False
        serial_num = radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)
        counter = -1
        
        for o in odpovedi:
            counter += 1
            if o["serial"] == serial_num:
                odpovedi[counter]["vote"] = value
                zmeneno = True
        if not zmeneno:
            odpovedi.push({"serial" : serial_num, "vote": value})

        radio.send_value("prijat", serial_num)
        #klient může  znova odpovídat

def on_button_pressed_a():
    global muzehlasovat

    if muzehlasovat:
        muzehlasovat = False
        radio.send_number(0)
    else:
        muzehlasovat = True
        radio.send_number(1)

input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    global odpovedi

    for i in range (0,5):
        pocet = 0
        for p in odpovedi:
            if p["vote"] == i:
                pocet += 1
        print(String.from_char_code(i+65) + ": " + pocet)
        basic.show_string(String.from_char_code(i+65) + ":" + pocet, 50)

        #zobrazování odpovědí
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_logo_event_pressed():
    global odpovedi
    for i in range(odpovedi.length):
        odpovedi.remove_at(i)
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_event_pressed)