#include <memory>
#include <unistd.h>

#include "Navio2/PWM.h"
#include "Navio2/RCOutput_Navio2.h"

#define ESC_INIT 900

#define SERVO_SET 1200

#define SERVO_MAX 1400
#define SERVO_MIN 1050

#define PWM0 0
#define PWM1 1
#define PWM2 2
#define PWM3 3

int main(void) {
        std::unique_ptr <RCOutput> pwm = std::unique_ptr <RCOutput> { new RCOutput_Navio2() };
	int pulse = SERVO_SET, limit = SERVO_MAX;

	if (getuid())
		return fprintf(stderr, "Permission denied\n"), 1;
	if (pulse > limit)
		return fprintf(stderr, "NO WAY BUDDY\n"), 1;
	if (!(pwm->initialize(PWM0)) ||
		!(pwm->initialize(PWM1)) ||
		!(pwm->initialize(PWM2)) ||
		!(pwm->initialize(PWM3)))
		return 1;
	pwm->set_frequency(PWM0, 24);
	pwm->set_frequency(PWM1, 24);
	pwm->set_frequency(PWM2, 24);
	pwm->set_frequency(PWM3, 24);
	if (!(pwm->enable(PWM0)) ||
		!(pwm->enable(PWM1)) ||
		!(pwm->enable(PWM2)) ||
		!(pwm->enable(PWM3)))
		return 1;
	for (int i = 0; i < 30; ++i) {
		pwm->set_duty_cycle(PWM0, ESC_INIT);
		pwm->set_duty_cycle(PWM1, ESC_INIT);
		pwm->set_duty_cycle(PWM2, ESC_INIT);
		pwm->set_duty_cycle(PWM3, ESC_INIT);
		usleep(100000);
	}
	while (true) {
		if (limit == SERVO_MAX)
			++pulse;
		else if (limit == SERVO_MIN)
			--pulse;
		if (pulse == limit)
			limit = limit == SERVO_MAX ? SERVO_MIN : SERVO_MAX;
		pwm->set_duty_cycle(PWM0, pulse);
		pwm->set_duty_cycle(PWM1, pulse);
		pwm->set_duty_cycle(PWM2, pulse);
		pwm->set_duty_cycle(PWM3, pulse);
		usleep(100000);
	}
	return 0;
}
