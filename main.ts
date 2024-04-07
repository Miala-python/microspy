function someone () {
    if (!(music.isSoundPlaying())) {
        music.play(music.stringPlayable("E B E A E G E F ", 200), music.PlaybackMode.LoopingInBackground)
    }
    if (input.buttonIsPressed(Button.AB)) {
        music.stopAllSounds()
        basic.pause(10000)
    }
}
// 8 => PIR Motion Sensor
led.enable(false)
pins.digitalWritePin(DigitalPin.P8, 0)
basic.forever(function () {
    if (1 == pins.digitalReadPin(DigitalPin.P8)) {
        someone()
    } else {
        music.stopAllSounds()
    }
})
