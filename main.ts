function Intrusion (Detecteur: string) {
    bluetooth.uartWriteLine("INTRUSION: " + Detecteur)
    son_à_stopper_ = true
}
input.onButtonPressed(Button.AB, function () {
    music.stopAllSounds()
    detect = false
    basic.pause(10000)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
    dist_OK = sonar.ping(
    DigitalPin.P2,
    DigitalPin.P1,
    PingUnit.Centimeters
    )
    detect = true
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    bt_reçu = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    bluetooth.uartWriteLine("CHECKED: " + "Monde")
    if (bt_reçu.includes("mus")) {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Double)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(196, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(294, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(330, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(349, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(392, music.beat(BeatFraction.Breve)), music.PlaybackMode.UntilDone)
    } else if (bt_reçu.includes("dtc")) {
        if (bt_reçu.includes("on")) {
            detect = true
        } else if (bt_reçu.includes("off")) {
            detect = false
        }
    } else if (bt_reçu.includes("rec")) {
        if (bt_reçu.includes("on")) {
            record.startRecording(record.BlockingState.Blocking)
        } else if (bt_reçu.includes("play")) {
            record.playAudio(record.BlockingState.Blocking)
        }
    }
})
// 8 => PIR Motion Sensor
// 1; 2 => Ultrasonic Module
let dist = 0
let bt_reçu = ""
let son_à_stopper_ = false
let dist_OK = 0
let detect = false
detect = false
bluetooth.startUartService()
let bt_i = 0
led.enable(false)
pins.digitalWritePin(DigitalPin.P8, 0)
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.UntilDone)
basic.pause(2000)
music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
detect = true
dist_OK = sonar.ping(
DigitalPin.P2,
DigitalPin.P1,
PingUnit.Centimeters
)
loops.everyInterval(10000, function () {
    bt_i += 1
    bluetooth.uartWriteNumber(bt_i)
    bluetooth.uartWriteLine("")
})
basic.forever(function () {
    if (detect) {
        if (music.volume() < 255) {
            music.setVolume(music.volume() + 25)
        }
        if (1 == pins.digitalReadPin(DigitalPin.P8)) {
            music.play(music.stringPlayable("E B E A E G E F ", 200), music.PlaybackMode.UntilDone)
            Intrusion("Mouvement IR")
        } else {
            dist = sonar.ping(
            DigitalPin.P2,
            DigitalPin.P1,
            PingUnit.Centimeters
            )
            if (dist > 10 && dist < 400 && 10 < Math.abs(dist_OK - dist)) {
                music.play(music.stringPlayable("B A C5 A B C5 B A ", 200), music.PlaybackMode.UntilDone)
                Intrusion("Sonar")
            } else {
                music.setVolume(105)
            }
        }
    }
})
loops.everyInterval(5000, function () {
    if (son_à_stopper_) {
        music.stopAllSounds()
        son_à_stopper_ = false
    }
})
