#include <csignal>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <errno.h>
#include <fcntl.h>
#include <fstream>
#include <iostream>
#include <memory>
#include <sstream>
#include <sys/file.h>
#include <sys/time.h>
#include <termios.h>
#include <unistd.h>
#include <vector>

#include "AHRS.hpp"

#include "Common/MS5611.h"
#include "Common/Ublox.h"
#include "Common/Util.h"

#include "Navio2/LSM9DS1.h"
#include "Navio2/RCOutput_Navio2.h"

#define UART_DEV "/dev/ttyAMA0"

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
	float pitch;
	float yaw;
	float roll;
} ldat;

typedef struct termios termios_t;

static int tty_config(termios_t *tty, int port);

static void read_MS5611(ldat *dat);
static void update_gps(ldat *dat);
static void update_stemp(ldat *dat);
static void update_ahrs(ldat *dat);
static void imu_update(AHRS *ahrs, ldat *dat);

volatile bool sending = true;

/**
 * main - infinite loop responsible for prompt and serial port communications
 * Return: 0, always
 */
int main(int argc __attribute__((unused)), char **argv) {
	std::size_t input_len{0};
	int prompt_ret{0}, uart_fd{-1};
	termios_t tty, save;
	ldat dat = { 0.f, 0.f, 0.0, 0.0, 0.f, 0.f, 0.f, 0.f };
	std::stringstream out;

	uart_fd = open(argv[1] ? argv[1] : UART_DEV, O_RDWR | O_NOCTTY);
	if (uart_fd < 0)
		return fprintf(stderr, "open error - %i: %s\n", errno, strerror(errno)), 1;
	if (tcgetattr(uart_fd, &tty))
		return fprintf(stderr, "tcgetattr error - %i: %s\n", errno, strerror(errno)), 1;
	save = tty;
	if (tty_config(&tty, uart_fd))
		return tcsetattr(uart_fd, TCSANOW, &save), 1;
	usleep(1000);
	while (sending) {
		out.str(std::string());
		read_MS5611(&dat);
		update_gps(&dat);
		update_stemp(&dat);
		update_ahrs(&dat);
		out << "{\"temperature\": \"" << dat.temperature
			<< "\", \"pressure\": \"" << dat.pressure
			<< "\", \"latitude\": \"" << dat.latitude
			<< "\", \"longitude\": \"" << dat.longitude
			<< "\", \"stemp\": \"" << dat.stemp 
			<< "\", \"pitch\": \"" << dat.pitch
			<< "\", \"yaw\": \"" << dat.yaw
			<< "\", \"roll\": \"" << dat.roll
			<< "\"}";
		std::cout << out.str() << std::endl;
		// std::cout << out.str().c_str() << std::endl;
		// std::cout << input << std::endl;
		write(uart_fd, out.str().c_str(), out.str().length());
		// printf("LENGTH OF OUTPUT: %u\n", strlen(out.str().c_str()));
		// usleep(28 * 100);
		// std::cout << "SENDING: " << input;
		// fflush(stdout);
		// sleep(1);
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
		barometer.initialize(), config = 1;
	barometer.refreshPressure();
	usleep(10000);
	barometer.readPressure();
	barometer.refreshTemperature();
	usleep(10000);
	barometer.readTemperature();
	barometer.calculatePressureAndTemperature();
	(*dat).pressure = barometer.getPressure();
	(*dat).temperature = barometer.getTemperature();
}

static void update_gps(ldat *dat) {
	static Ublox gps;
	static std::vector<double> position;
	int config{0};

	if (!config && gps.configureSolutionRate(1000))
		std::cerr << "Failed to set GPS rate: EXITING" << std::endl, exit(1);
	if (gps.decodeSingleMessage(Ublox::NAV_POSLLH, position)) {
		if (position[2])
			(*dat).latitude = position[2]/10000000;
		if (position[1])
			(*dat).longitude = position[1]/10000000;
	}
	usleep(200);
}

static void update_stemp(ldat *dat) {
	std::ifstream stemp_file("/sys/class/thermal/thermal_zone0/temp");
	std::stringstream buff;

	buff << stemp_file.rdbuf();
	stemp_file.close();
	(*dat).stemp = std::stof(buff.str());
	(*dat).stemp /= 1000;
}

static void update_ahrs(ldat *dat) {
	static std::unique_ptr <AHRS> ahrs;
	static std::unique_ptr <InertialSensor> imu;
	int config{0};

	if (!config) {
		imu = std::unique_ptr <InertialSensor> { new LSM9DS1() };
		ahrs = std::unique_ptr <AHRS> { new AHRS(move(imu)) };
		ahrs->setGyroOffset();
		config = 1;
	}
	imu_update(ahrs.get(), dat);
}

static void imu_update(AHRS *ahrs, ldat *dat) {
	float roll, pitch, yaw, dt;
	struct timeval tv;
	static float maxdt, mindt = 0.01, dtsumm = 0;
	static int is_first = 1;
	static unsigned long previoustime, currenttime;

	gettimeofday(&tv, nullptr);
	previoustime = currenttime;
	currenttime = 1000000 * tv.tv_sec + tv.tv_usec;
	dt = (currenttime - previoustime) / 1000000.0;
	if (dt < 1 / 1300.0)
		usleep((1 / 1300.0 - dt) * 1000000);
	gettimeofday(&tv, nullptr);
	currenttime = 1000000 * tv.tv_sec + tv.tv_usec;
	dt = (currenttime - previoustime) / 1000000.0;
	ahrs->updateIMU(dt);
	ahrs->getEuler(&roll, &pitch, &yaw);
	if (!is_first) {
		if (dt > maxdt) maxdt = dt;
		if (dt < mindt) mindt = dt;
	}
	is_first = 0;
	dtsumm += dt;
	if (dtsumm > 0.05) {
		(*dat).pitch = pitch;
		(*dat).yaw = yaw * -1;
		(*dat).roll = roll;
		dtsumm = 0;
	}
}
