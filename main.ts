input.onSound(DetectedSound.Loud, function () {
    if (dtc_on) {
        dected_("Microphone:" + input.soundLevel())
    }
})
// start
function dtc_reset () {
    light_OK = pins.analogReadPin(AnalogPin.P3)
    dist_OK = sonar.ping(
    DigitalPin.P2,
    DigitalPin.P1,
    PingUnit.Centimeters
    )
    dtc_on = true
}
function dected_ (val: string) {
    bluetooth.uartWriteLine("INTRUSION " + val)
    dtc = val
    basic.pause(500)
}
function Au_sercours_ (Ahhh: string) {
    dected_("Au secours: " + Ahhh)
    music.play(music.createSoundExpression(WaveShape.Square, 2779, 5000, 255, 255, 500, SoundExpressionEffect.Warble, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    music.ringTone(2000)
    music.play(music.createSoundExpression(WaveShape.Noise, 2779, 5000, 255, 255, 5000, SoundExpressionEffect.Warble, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
    music.stopAllSounds()
}
input.onButtonPressed(Button.AB, function () {
    music.stopAllSounds()
    dtc_on = false
    basic.pause(10000)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
    dist_OK = sonar.ping(
    DigitalPin.P2,
    DigitalPin.P1,
    PingUnit.Centimeters
    )
    dtc_on = true
})
input.onGesture(Gesture.Shake, function () {
    Au_sercours_("Secoue")
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    dtc_on = false
    music.play(music.stringPlayable("A C - - - - - - ", 200), music.PlaybackMode.UntilDone)
    basic.pause(10000)
    dtc_reset()
    music.play(music.stringPlayable("C A - - - - - - ", 200), music.PlaybackMode.UntilDone)
})
input.onGesture(Gesture.ThreeG, function () {
    Au_sercours_("Force:3g")
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    bt_reçu = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    bluetooth.uartWriteLine("CHECKED: " + bt_reçu)
    if (bt_reçu.includes("mus")) {
        music.setVolume(255)
        music.setTempo(100)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Double)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(196, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(294, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(330, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(349, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(392, music.beat(BeatFraction.Breve)), music.PlaybackMode.UntilDone)
    } else if (bt_reçu.includes("dtc")) {
        if (bt_reçu.includes("on")) {
            dtc_reset()
        } else if (bt_reçu.includes("off")) {
            dtc_on = false
        }
    }
})
// 1; 2 => Ultrasonic Module
// 3 => TEMT6000 Ambient Light Sensor
// 8 => PIR Motion Sensor
let dist = 0
let bt_reçu = ""
let dtc = ""
let light_OK = 0
let dist_OK = 0
let dtc_on = false
input.setSoundThreshold(SoundThreshold.Loud, 200)
dtc_on = false
dist_OK = 0
light_OK = 0
let bt_i = 0
dtc = ""
bluetooth.startUartService()
led.enable(true)
basic.showLeds(`
    # . . . #
    # # . # #
    # . # . #
    # . . . #
    # . . . #
    `)
basic.pause(2000)
led.enable(false)
dtc_reset()
loops.everyInterval(10000, function () {
    bt_i += 10
    bluetooth.uartWriteNumber(bt_i)
    bluetooth.uartWriteLine("s started")
})
basic.forever(function () {
    if (dtc_on) {
        if (1 == pins.digitalReadPin(DigitalPin.P8)) {
            dected_("IR")
        } else if (Math.abs(light_OK - pins.analogReadPin(AnalogPin.P3)) > 300) {
            dected_("Light")
        } else {
            dist = sonar.ping(
            DigitalPin.P2,
            DigitalPin.P1,
            PingUnit.Centimeters
            )
            if (dist > 10 && dist < 400 && 10 < Math.abs(dist_OK - dist)) {
                dected_("Sonar")
            }
        }
    }
})
basic.forever(function () {
    if (!(dtc.isEmpty())) {
        music.play(music.stringPlayable("C5 A E B E A F C5 ", 350), music.PlaybackMode.UntilDone)
        basic.pause(100)
        if (music.volume() < 25) {
            music.setVolume(music.volume() + 25)
        }
    } else {
        music.setVolume(105)
    }
})
