bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    if ("zelda" == bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))) {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Double)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(196, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(294, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(330, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(349, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(392, music.beat(BeatFraction.Breve)), music.PlaybackMode.UntilDone)
    }
})
// 8 => PIR Motion Sensor
// 1; 2 => Ultrasonic Module
let son_à_stopper_ = false
let loaded = false
bluetooth.startUartService()
let bt_i = 0
led.enable(false)
pins.digitalWritePin(DigitalPin.P8, 0)
music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.UntilDone)
basic.pause(2000)
music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
loaded = true
let dist_OK = sonar.ping(
DigitalPin.P2,
DigitalPin.P1,
PingUnit.Centimeters
)
loops.everyInterval(1000, function () {
    bt_i += 1
    bluetooth.uartWriteNumber(bt_i)
    bluetooth.uartWriteLine("")
})
basic.forever(function () {
    if (loaded) {
        if (1 == pins.digitalReadPin(DigitalPin.P8)) {
            if (!(music.isSoundPlaying())) {
                music.play(music.stringPlayable("E B E A E G E F ", 200), music.PlaybackMode.LoopingInBackground)
                bluetooth.uartWriteString("INTRUSION Mouvement !")
            }
        } else {
            if (10 < Math.abs(dist_OK - sonar.ping(
            DigitalPin.P2,
            DigitalPin.P1,
            PingUnit.Centimeters
            ))) {
                if (!(music.isSoundPlaying())) {
                    music.play(music.stringPlayable("B A C5 A B C5 B A ", 200), music.PlaybackMode.LoopingInBackground)
                    bluetooth.uartWriteString("INTRUSION Sonar !")
                }
            }
        }
        if (input.buttonIsPressed(Button.AB)) {
            music.stopAllSounds()
            basic.pause(10000)
            music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
            dist_OK = sonar.ping(
            DigitalPin.P2,
            DigitalPin.P1,
            PingUnit.Centimeters
            )
        }
    }
})
loops.everyInterval(7000, function () {
    if (son_à_stopper_) {
        music.stopAllSounds()
    }
    son_à_stopper_ = music.isSoundPlaying()
})
