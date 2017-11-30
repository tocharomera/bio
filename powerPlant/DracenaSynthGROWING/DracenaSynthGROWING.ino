#include <CapacitiveSensor.h>


#include <avr/pgmspace.h>
#include <Audio.h>
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <SerialFlash.h>
#include <stdint.h>

#include "AKWF_violin.h"

#include "AKWF_cello.h"
#include "AKWF_hvoice.h"

int currentaverage = 0;                                               // current averaged reading
int oldaverage = 0;
const int pump =  21;      // the number of the LED pin

// Variables will change:
// sign of previous slope, false = negative
long previousMillis = 0;
int peak;
const int numReadings = 20;

int readings[numReadings];      // the readings from the analog input
int readIndex = 0;              // the index of the current reading
int total = 0;                  // the running total
int average = 0;                // the average


// GUItool: begin automatically generated code
AudioSynthWaveform waveform1;
AudioSynthWaveform waveform2;
AudioFilterBiquad        biquad2;

AudioOutputI2S i2s1;

AudioEffectFlange        flange1;
AudioFilterBiquad        biquad1;
AudioEffectDelay         delay1;
AudioMixer4              mixer1;
AudioConnection          patchCord1(waveform1, flange1);

AudioConnection          patchCord2(flange1, biquad1);
AudioConnection          patchCord3(biquad1, 0, mixer1, 0);
AudioConnection          patchCord4(mixer1, 0, i2s1, 0);
AudioConnection          patchCord5(mixer1, 0, i2s1, 1);
AudioConnection          d1(waveform2, biquad2);

AudioConnection          pd3(biquad2, 0, mixer1, 1);
AudioControlSGTL5000 audioShield;
// GUItool: end automatically generated code
// Number of samples in each delay line
#define FLANGE_DELAY_LENGTH (20*AUDIO_BLOCK_SAMPLES)
// Allocate the delay lines for left and right channels
short l_delayline[FLANGE_DELAY_LENGTH];
short r_delayline[FLANGE_DELAY_LENGTH];
int s_idx = FLANGE_DELAY_LENGTH / 8;
int s_depth = FLANGE_DELAY_LENGTH / 6;
double s_freq = .5;

int umbral1;
int touchReading1;
int light1;
extern volatile unsigned long timer0_millis;

void setup() {

  Serial.begin(115200);

  AudioMemory(8); //audioblock
  audioShield.enable();
  audioShield.volume(0.35);

  pinMode(21, OUTPUT);

  pinMode(1, OUTPUT);
  umbral1 = touchRead(16);
  peak = 10000;
for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    readings[thisReading] = 0;
  }

}

void loop() {
  

  total = total - readings[readIndex];
  readings[readIndex] = touchRead(16);
  total = total + readings[readIndex];
  readIndex = readIndex + 1;
  if (readIndex >= numReadings) {
    // ...wrap around to the beginning:
    readIndex = 0;
  }
  average = total / numReadings;
  
  currentaverage=average;
  
 
   light1 = map(currentaverage, umbral1, peak  , -50, 500);
     //touch pin (button)
  Serial.print("touchRead:");
  Serial.println(currentaverage);

  Serial.print("peak");
  Serial.println(peak);
  delay(11);
  if (currentaverage < peak) {

    int n = random(AKWF_hvoice_[257]);
    waveform1.arbitraryWaveform(AKWF_hvoice_ + n, 8000);
    waveform1.begin(0.5, random(4000), WAVEFORM_ARBITRARY);
    flange1.begin(l_delayline, FLANGE_DELAY_LENGTH, s_idx, s_depth, s_freq);
    biquad1.setLowpass(0, currentaverage, 00.057);
    //delay1.delay(0,300);
    mixer1.gain(0, 0.2);
    mixer1.gain(1, 0);
    analogWrite(A14, light1);
    Serial.print("LIGHT");
    Serial.println(light1);
    if (peak > currentaverage*4)peak -= 1;

  } else  {

    Serial.println("light");
    Serial.println(light1);
    int n = random(AKWF_hvoice_[257]);

    waveform1.arbitraryWaveform(AKWF_hvoice_ + n, 10000);
    waveform1.begin(0.5, touchReading1, WAVEFORM_ARBITRARY);
    biquad1.setHighpass(0, peak, 00.057);
    delay(random(8));
    mixer1.gain(0, 0.7);
    mixer1.gain(1, 0.7);


    analogWrite(A14, light1);
  }
 if (currentaverage > oldaverage) {
    oldaverage = currentaverage;
    peak = currentaverage;

  }
}

