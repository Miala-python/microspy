# start
def dtc_reset():
    global dist_OK2
    dist_OK2 = sonar.ping(DigitalPin.P2, DigitalPin.P1, PingUnit.CENTIMETERS)

def on_button_pressed_ab():
    global detect, dist_OK
    music.stop_all_sounds()
    detect = False
    basic.pause(10000)
    music.play(music.builtin_playable_sound_effect(soundExpression.hello),
        music.PlaybackMode.UNTIL_DONE)
    dist_OK = sonar.ping(DigitalPin.P2, DigitalPin.P1, PingUnit.CENTIMETERS)
    detect = True
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_uart_data_received():
    global bt_reçu, detect
    bt_reçu = bluetooth.uart_read_until(serial.delimiters(Delimiters.NEW_LINE))
    bluetooth.uart_write_line("CHECKED: " + bt_reçu)
    if bt_reçu.includes("mus"):
        music.set_volume(255)
        music.set_tempo(100)
        music.play(music.tone_playable(262, music.beat(BeatFraction.DOUBLE)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(196, music.beat(BeatFraction.WHOLE)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(262, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(294, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(330, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(349, music.beat(BeatFraction.QUARTER)),
            music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(392, music.beat(BeatFraction.BREVE)),
            music.PlaybackMode.UNTIL_DONE)
    elif bt_reçu.includes("dtc"):
        if bt_reçu.includes("on"):
            detect = True
        elif bt_reçu.includes("off"):
            detect = False
bluetooth.on_uart_data_received(serial.delimiters(Delimiters.NEW_LINE),
    on_uart_data_received)

# 1; 2 => Ultrasonic Module
# 8 => PIR Motion Sensor
dist = 0
bt_i = 0
bt_reçu = ""
detect = False
dist_OK2 = 0
son_à_stopper_ = False
dist_OK = 0
dist_OK = 0
bluetooth.start_uart_service()
led.enable(True)
basic.show_leds("""
    # . . . #
    # # . # #
    # . # . #
    # . . . #
    # . . . #
    """)
basic.pause(2000)
led.enable(False)
dtc_reset()

def on_every_interval():
    global bt_i
    bt_i += 1
    bluetooth.uart_write_number(bt_i)
    bluetooth.uart_write_line("")
loops.every_interval(10000, on_every_interval)

def on_forever():
    if 1 == pins.digital_read_pin(DigitalPin.P8):
        dtc_on
    else:
        dist2 = sonar.ping(DigitalPin.P2, DigitalPin.P1, PingUnit.CENTIMETERS)
        if dist2 > 10 and dist2 < 400 and 10 < abs(dist_OK - dist2):
            music.play(music.string_playable("B A C5 A B C5 B A ", 200),
                music.PlaybackMode.UNTIL_DONE)
            Intrusion("Sonar")
        else:
            music.set_volume(105)
basic.forever(on_forever)

def on_forever2():
    global dist
    if detect:
        if music.volume() < 255:
            music.set_volume(music.volume() + 25)
        if 1 == pins.digital_read_pin(DigitalPin.P8):
            music.play(music.string_playable("E B E A E G E F ", 200),
                music.PlaybackMode.UNTIL_DONE)
            Intrusion("Mouvement IR")
        else:
            dist = sonar.ping(DigitalPin.P2, DigitalPin.P1, PingUnit.CENTIMETERS)
            if dist > 10 and dist < 400 and 10 < abs(dist_OK - dist):
                music.play(music.string_playable("B A C5 A B C5 B A ", 200),
                    music.PlaybackMode.UNTIL_DONE)
                Intrusion("Sonar")
            else:
                music.set_volume(105)
basic.forever(on_forever2)
