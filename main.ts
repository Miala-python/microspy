// 8 => PIR Motion Sensor
// 1; 2 => Ultrasonic Module
let son_à_stopper_ = false
let loaded = false
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
basic.forever(function () {
    if (loaded) {
        if (1 == pins.digitalReadPin(DigitalPin.P8)) {
            if (!(music.isSoundPlaying())) {
                music.play(music.stringPlayable("E B E A E G E F ", 200), music.PlaybackMode.LoopingInBackground)
            }
        } else {
            if (10 < Math.abs(dist_OK - sonar.ping(
            DigitalPin.P2,
            DigitalPin.P1,
            PingUnit.Centimeters
            ))) {
                if (!(music.isSoundPlaying())) {
                    music.play(music.stringPlayable("B A C5 A B C5 B A ", 200), music.PlaybackMode.LoopingInBackground)
                }
            }
        }
        if (input.buttonIsPressed(Button.AB)) {
            music.stopAllSounds()
            basic.pause(10000)
        }
    }
})
loops.everyInterval(7000, function () {
    if (son_à_stopper_) {
        music.stopAllSounds()
    }
    son_à_stopper_ = music.isSoundPlaying()
})
