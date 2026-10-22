#include "Ultrasonic.h"

const int pinoTrigger = 12;
const int pinoEcho = 13;
int presenca;
int id = 1;
int regiao = 0;

Ultrasonic sensor(pinoTrigger, pinoEcho);

void setup() {
  Serial.begin(9600);
}

void loop() {
  float distancia = sensor.read();

  if(distancia > 0 && distancia < 30){
    presenca = 1;
  } else {
    presenca = 0;
  }
  
  Serial.print(presenca);
  Serial.print(';');
  Serial.print(id);
  Serial.print(';');
  Serial.println(regiao);
  delay(1000);
}