#include "Ultrasonic.h"

const int PINO_TRIGGER = 12;
const int PINO_ECHO = 13;

Ultrasonic sensor(PINO_TRIGGER, PINO_ECHO);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  float distancia = sensor.read();

  if(distancia > 0 && distancia < 5){
    Serial.println("1");
  } else {
    Serial.println("0");
  }
  
  delay(1000);
}
