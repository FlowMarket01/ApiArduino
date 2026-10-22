#include "Ultrasonic.h"

const int pinoTrigger = 12;
const int pinoEcho = 13;
int presenca;
int id = 1;
int regiao = 0;

HC_SR04 sensor(pinoTrigger, pinoEcho);

void setup() {
  Serial.begin(9600);
}

void loop() {
  float distancia = sensor.distance();

  if(distancia > 0 && distancia < 30){
    presenca = 1;
  } else {
    presenca = 0;
  }
  
  Serial.println(presenca+';'+id+';'+regiao);
  delay(1000);
}
