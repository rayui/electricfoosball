const byte MSG_DELIM[] = {0, 0, 0xFF};
const byte MSG_END[] = {0};

const char GOAL_A_STRING[7] = {"GOAL_A"};
const char GOAL_B_STRING[7] = {"GOAL_B"};
const char BTN_A_STRING[7] = {"BTN_A"};
const char BTN_B_STRING[7] = {"BTN_B"};
const char BTN_C_STRING[7] = {"BTN_C"};
const char BTN_D_STRING[7] = {"BTN_D"};

const byte GOAL_LED_PIN = 5;
const byte GOAL_A_SENSOR_PIN = 2;
const byte GOAL_B_SENSOR_PIN = 3;
const byte BTN_A_PIN = 8;
const byte BTN_B_PIN = 9;
const byte BTN_C_PIN = 11;
const byte BTN_D_PIN = 12;

const long GOAL_DEBOUNCE_TIME = 5000;
const long BTN_DEBOUNCE_TIME = 50;

volatile int goalAState = HIGH;
volatile int goalBState = HIGH;

long goalATime = millis();
long goalBTime = millis();

int buttonStateA = HIGH;
int buttonStateB = HIGH;
int buttonStateC = HIGH;
int buttonStateD = HIGH;

long buttonTimeA = millis();
long buttonTimeB = millis();
long buttonTimeC = millis();
long buttonTimeD = millis();

int debounceGoal(long* lastTime) {
  long now = millis();
  
  if (now - *lastTime < GOAL_DEBOUNCE_TIME) {
    return true; 
  }
  *lastTime = now;
  return false;
}

int debounceButton(const byte* pin, int* previousState, long* lastTime) {
  long now = millis();
  int currentState = digitalRead(*pin);
    
  if (now - *lastTime > BTN_DEBOUNCE_TIME &&  //is greater than max bounce time
    currentState != *previousState         //is not same as previous state 
  ) {
    //button has been pushed for real
    *lastTime = now;
    //not 
    return false;
  }

  return true;
}

void setup() {
  
  pinMode(GOAL_LED_PIN, OUTPUT);
  tone (GOAL_LED_PIN, 38000);
 
  Serial.begin(9600);          //  setup serial

  digitalWrite(GOAL_A_SENSOR_PIN, HIGH);    //set pullup resistor
  digitalWrite(GOAL_B_SENSOR_PIN, HIGH);    //set pullup resistor
  digitalWrite(BTN_A_PIN, HIGH);    //set pullup resistor
  digitalWrite(BTN_B_PIN, HIGH);    //set pullup resistor
  digitalWrite(BTN_C_PIN, HIGH);    //set pullup resistor
  digitalWrite(BTN_D_PIN, HIGH);    //set pullup resistor
  
  attachInterrupt(0, goalA, FALLING);
  attachInterrupt(1, goalB, FALLING);

}

void loop() {
  if (goalAState == true) {
    if (!debounceGoal(&goalATime)) {
      sendSerial(GOAL_A_STRING);
    }
    goalAState = false;
  } else if (goalBState == true) {
    if (!debounceGoal(&goalBTime)) {
      sendSerial(GOAL_B_STRING);
    }
    goalBState = false;
  }
  
  if (!debounceButton(&BTN_A_PIN, &buttonStateA, &buttonTimeA)) {
    buttonStateA = !buttonStateA;
    if (buttonStateA) {
      sendSerial(BTN_A_STRING);
    }
  } else if (!debounceButton(&BTN_B_PIN, &buttonStateB, &buttonTimeB)) {
    buttonStateB = !buttonStateB;
    if (buttonStateB) {
      sendSerial(BTN_B_STRING);
    }
  } else if (!debounceButton(&BTN_C_PIN, &buttonStateC, &buttonTimeC)) {
    buttonStateC = !buttonStateC;
    if (buttonStateC) {
      sendSerial(BTN_C_STRING);
    }
  } else if (!debounceButton(&BTN_D_PIN, &buttonStateD, &buttonTimeD)) {
    buttonStateD = !buttonStateD;
    if (buttonStateD) {
      sendSerial(BTN_D_STRING);
    }
  }
}

void goalA() {
  goalAState = true;
}

void goalB() {
  goalBState = true;
}

void sendSerial(const char *message) {
  Serial.write(MSG_DELIM, 3);
  Serial.write(message);
  Serial.write(MSG_END, 1);
  Serial.println();
}
