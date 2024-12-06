#include <csignal>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <errno.h>
#include <fcntl.h>
#include <fstream>
#include <iostream>
#include <memory>
#include <sys/file.h>
#include <termios.h>
#include <unistd.h>
#include <vector>

#include "Common/MS5611.h"
#include "Common/Ublox.h"
#include "Common/Util.h"

// #include "Navio2/PWM.h"
#include "Navio2/RCOutput_Navio2.h"

#define UART_DEV "/dev/ttyAMA0"

#define SERVO_MIN 1250 // mS
#define SERVO_MAX 1750 // mS

#define PWM_OUTPUT 0

// struct termios {
//     tcflag_t c_iflag;	/* input mode flags */
//     tcflag_t c_oflag;	/* output mode flags */
//     tcflag_t c_cflag;	/* control mode flags */
//     tcflag_t c_lflag;	/* local mode flags */
//     cc_t c_line;			/* line discipline */
//     cc_t c_cc[NCCS];		/* control characters */
//     speed_t c_ispeed;	/* input speed */
//     speed_t c_ospeed;	/* output speed */
// };

typedef struct live_data_s {
	float temperature;
	float pressure;
	double latitude;
	double longitude;
	float stemp;
} ldat;

typedef struct termios termios_t;

static int tty_config(termios_t *tty, int port);

static void read_MS5611(ldat *dat);
static void update_gps(ldat *dat);
static void update_stemp(ldat *dat);

volatile bool sending = true;

/**
 * main - infinite loop responsible for prompt and serial port communications
 * Return: 0, always
 */
int main(int argc __attribute__((unused)), char **argv) {
	uint8_t input[28] = {0};
	std::size_t input_len{0};
	int prompt_ret{0}, uart_fd{-1};
	termios_t tty, save;
	ldat dat;

	if (argc != 2)
		return fprintf(stderr, "Please supply device (e.g. /dev/ttyUSB0)\n");
	uart_fd = open(argv[1], O_RDWR | O_NOCTTY);
	if (uart_fd < 0)
		return fprintf(stderr, "open error - %i: %s\n", errno, strerror(errno)), 1;
	if (tcgetattr(uart_fd, &tty))
		return fprintf(stderr, "tcgetattr error - %i: %s\n", errno, strerror(errno)), 1;
	save = tty;
	if (tty_config(&tty, uart_fd))
		return tcsetattr(uart_fd, TCSANOW, &save), 1;
	usleep(1000);
	while (sending) {
		read_MS5611(&dat);
		update_gps(&dat);
		update_stemp(&dat);
		memcpy(input, &dat, sizeof(ldat));
		puts("made it");
		std::cout << input << std::endl;
		write(uart_fd, input, 28);
		// usleep(28 * 100);
		// std::cout << "SENDING: " << input;
		fflush(stdout);
	}
	tcsetattr(uart_fd, TCSANOW, &save);
	close(uart_fd);
	return (0);
}

/**
 * tty_config - sets flags for and configures termios data structure
 * @tty: pointer to termios data structure
 * @port: file descriptor for open serial port
 * Return: 0 upon success, otherwise 1
 */
static int tty_config(termios_t *tty, int port) {
	cfmakeraw(tty);
	cfsetospeed(tty, B57600);
	cfsetispeed(tty, B57600);
	tty->c_cflag = (tty->c_cflag & ~CSIZE) | CS8;
	tty->c_cflag |= (CLOCAL | CREAD);
	tty->c_cflag &= ~(PARENB | PARODD);
	tty->c_cflag |= 0;
	tty->c_cflag &= ~CSTOPB;
	tty->c_cflag &= ~CRTSCTS;
	tty->c_iflag &= ~IGNBRK;
	tty->c_iflag &= ~(IXON | IXOFF | IXANY);
	tty->c_lflag = 0;
	tty->c_oflag = 0;
	tty->c_cc[VMIN] = 0;
	tty->c_cc[VTIME] = 10;
	if (tcsetattr(port, TCSANOW, tty))
		return fprintf(stderr, "tcsetattr error - %i: %s\n", errno, strerror(errno)), 1;
	return 0;
}

static void read_MS5611(ldat *dat) {
	static MS5611 barometer;
	static int config{0};

	if (!config)
		barometer.initialize();
	barometer.refreshPressure();
	usleep(10000);
	barometer.readPressure();
	(*dat).pressure = barometer.getPressure();
	barometer.refreshTemperature();
	usleep(10000);
	barometer.readTemperature();
	(*dat).temperature = barometer.getTemperature();
	barometer.calculatePressureAndTemperature();
}

static void update_gps(ldat *dat) {
	static Ublox gps;
	static std::vector<double> position;
	int config{0};

	if (!config && !gps.configureSolutionRate(1000))
		std::cerr << "Failed to set GPS rate: EXITING" << std::endl, exit(1);
	if (gps.decodeSingleMessage(Ublox::NAV_POSLLH, position)) {
		(*dat).latitude = position[2]/10000000;
		(*dat).longitude = position[1]/10000000;
	}
	usleep(200);
}

static void update_stemp(ldat *dat) {
	static std::ifstream stemp_file;

	stemp_file.open("/sys/class/thermal/thermal_zone0/temp");
	stemp_file >> (*dat).stemp;
	(*dat).stemp /= 1000;
}
