#!/usr/bin/python3

import sys
import time

import navio.pwm
import navio.util


navio.util.check_apm()

if len(sys.argv) < 2:
    sys.exit('Please supply PWM port')

PWM_OUTPUT = sys.argv[1]
SERVO_MIN = 0.900

with navio.pwm.PWM(PWM_OUTPUT) as pwm:
    pwm.set_period(50)
    pwm.enable()
    while (True):
        pwm.set_duty_cycle(SERVO_MIN)
        time.sleep(0.3)
