#include <memory>
#include <unistd.h>

#include "Common/Util.h"

#include "Navio2/PWM.h"
#include "Navio2/RCOutput_Navio2.h"

#define SERVO_MIN 1250 /*mS*/
#define SERVO_MAX 1750 /*mS*/

#define SERVO_SET 1550

#define ESC_INIT 900

#define PWM0 0
#define PWM1 1
#define PWM2 2
#define PWM3 3

// using namespace Navio;

int main(void) {
        std::unique_ptr <RCOutput> pwm = std::unique_ptr <RCOutput> { new RCOutput_Navio2() };

	if (getuid())
		return fprintf(stderr, "Launch with root priveleges\n"), 1;
	if (!(pwm->initialize(PWM0)) ||
		!(pwm->initialize(PWM1)) ||
		!(pwm->initialize(PWM2)) ||
		!(pwm->initialize(PWM3)))
		return 1;
	pwm->set_frequency(PWM0, 8);
	pwm->set_frequency(PWM1, 8);
	pwm->set_frequency(PWM2, 8);
	pwm->set_frequency(PWM3, 8);
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
		pwm->set_duty_cycle(PWM0, SERVO_SET);
		pwm->set_duty_cycle(PWM1, SERVO_SET);
		pwm->set_duty_cycle(PWM2, SERVO_SET);
		pwm->set_duty_cycle(PWM3, SERVO_SET);
		usleep(100000);
	}
	return 0;
}
