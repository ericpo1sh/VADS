#!/usr/bin/python3

import sys
import time

import navio.pwm
import navio.util


navio.util.check_apm()

if len(sys.argv) < 2:
    sys.exit('Please supply PWM port')

PWM_OUTPUT = sys.argv[1]
ESC_INIT = 0.900
STEADY = 1.050

with navio.pwm.PWM(PWM_OUTPUT) as pwm:
    pwm.set_period(50)
    pwm.enable()
    for i in range(30):
        pwm.set_duty_cycle(ESC_INIT)
        time.sleep(0.1)
    while (True):
        pwm.set_duty_cycle(STEADY)
        time.sleep(0.1)
