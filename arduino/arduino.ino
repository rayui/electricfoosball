const byte MSG_DELIM[] = {0, 0, 0xFF};
const byte MSG_END[] = {0};

const char GOAL_A_STRING[7] = {"GOAL_A"};
const char GOAL_B_STRING[7] = {"GOAL_B"};
const char BTN_A_STRING[6] = {"BTN_A"};
const char BTN_B_STRING[6] = {"BTN_B"};
const char BTN_C_STRING[6] = {"BTN_C"};
const char BTN_D_STRING[6] = {"BTN_D"};

String LED_SHORT_STRING = "LED_SHORT\n";
String LED_LONG_STRING = "LED_LONG\n";
String ENABLE_BEAM_STRING = "ENABLE_BEAM\n";
String DISABLE_BEAM_STRING = "DISABLE_BEAM\n";

const byte GOAL_LED_PIN = 5;
const byte UI_LED_PIN = 6;
const byte GOAL_A_SENSOR_PIN = 2;
const byte GOAL_B_SENSOR_PIN = 3;
const byte BTN_A_PIN = 11;
const byte BTN_B_PIN = 9;
const byte BTN_C_PIN = 8;
const byte BTN_D_PIN = 12;

const long GOAL_DEBOUNCE_MAX_TIME = 4000;
const long DEBOUNCE_BUTTON_TIME = 50;

int goalAState = false;
int goalBState = false;

long goalADebounceTime = millis();
long goalBDebounceTime = millis();
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

String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complete

void sendSerial(const char *message) {
  Serial.write(MSG_DELIM, 3);
  Serial.write(message);
  Serial.write(MSG_END, 1);
  Serial.println();
}

int debounce(const byte* pin, int* previousState, long* lastTime) {
  long now = millis();
  int currentState = digitalRead(*pin);
    
  if (now - *lastTime > DEBOUNCE_BUTTON_TIME &&  //is greater than max bounce time
    currentState != *previousState         //is not same as previous state 
  ) {
    //button has been pushed for real
    *lastTime = now;
    //not 
    return false;
  }

  return true;
}

void enableLED() {
  noTone(GOAL_LED_PIN);
}

void longBlink() {
  noTone(GOAL_LED_PIN);
  tone(UI_LED_PIN, 31, 1000);
}

void shortBlink() {
  noTone(GOAL_LED_PIN);
  tone(UI_LED_PIN, 31, 100);
}

void disableLED() {
  noTone(UI_LED_PIN);
}

void enableBeam() {
  goalATime = millis();
  goalBTime = millis();
  goalADebounceTime = millis();
  goalBDebounceTime = millis();
  noTone(UI_LED_PIN);
  tone (GOAL_LED_PIN, 38000);
}

void disableBeam() {
  noTone(GOAL_LED_PIN);
}

void serialEvent(){
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read(); 
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    } 
  }
}

void setup() {
  
  pinMode(GOAL_LED_PIN, OUTPUT);
  pinMode(UI_LED_PIN, OUTPUT);
  
  inputString.reserve(200);
 
  Serial.begin(9600);          //  setup serial

  digitalWrite(GOAL_A_SENSOR_PIN, HIGH);    //set pullup resistor
  digitalWrite(GOAL_B_SENSOR_PIN, HIGH);    //set pullup resistor
  digitalWrite(BTN_A_PIN, HIGH);    //set pullup resistor
  digitalWrite(BTN_B_PIN, HIGH);    //set pullup resistor
  digitalWrite(BTN_C_PIN, HIGH);    //set pullup resistor
  digitalWrite(BTN_D_PIN, HIGH);    //set pullup resistor
  
  longBlink();

}

void loop() {
  
  if (!debounce(&GOAL_A_SENSOR_PIN, &goalAState, &goalADebounceTime)) {
    goalAState = !goalAState;
    if (goalAState) {
      if (goalADebounceTime - goalATime > GOAL_DEBOUNCE_MAX_TIME) {
        goalATime = goalADebounceTime;
        sendSerial(GOAL_A_STRING);
      }
    }
  } else if (!debounce(&GOAL_B_SENSOR_PIN, &goalBState, &goalBDebounceTime)) {
    goalBState = !goalBState;
    if (goalBState) {
      if (goalBDebounceTime - goalBTime > GOAL_DEBOUNCE_MAX_TIME) {
        goalBTime = goalBDebounceTime;
        sendSerial(GOAL_B_STRING);
      }
    }
  }
  
  if (!debounce(&BTN_A_PIN, &buttonStateA, &buttonTimeA)) {
    buttonStateA = !buttonStateA;
    if (buttonStateA) {
      sendSerial(BTN_A_STRING);
    }
  } else if (!debounce(&BTN_B_PIN, &buttonStateB, &buttonTimeB)) {
    buttonStateB = !buttonStateB;
    if (buttonStateB) {
      sendSerial(BTN_B_STRING);
    }
  } else if (!debounce(&BTN_C_PIN, &buttonStateC, &buttonTimeC)) {
    buttonStateC = !buttonStateC;
    if (buttonStateC) {
      sendSerial(BTN_C_STRING);
    }
  } else if (!debounce(&BTN_D_PIN, &buttonStateD, &buttonTimeD)) {
    buttonStateD = !buttonStateD;
    if (buttonStateD) {
      sendSerial(BTN_D_STRING);
    }
  }
  
  // print the string when a newline arrives:
  if (stringComplete) {
    if (inputString.equals(LED_SHORT_STRING)) {
      shortBlink(); 
    } else if (inputString.equals(LED_LONG_STRING)) {
      longBlink();
    } else if (inputString.equals(ENABLE_BEAM_STRING)) {
      enableBeam();
    } else if (inputString.equals(DISABLE_BEAM_STRING)) {
      disableBeam();
    }
    // clear the string:
    inputString = "";
    stringComplete = false;
  }
  
}
