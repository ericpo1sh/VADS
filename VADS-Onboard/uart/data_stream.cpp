#include "live_data.hpp"

#define UART_DEV "/dev/ttyAMA0"

static int tty_config(termios_t *tty, int port);

volatile bool sending = true;

/**
 * main - infinite loop responsible for prompt and serial port communications
 * Return: 0, always
 */
int main(int argc __attribute__((unused)), char **argv) {
	std::size_t input_len{0};
	int prompt_ret{0}, uart_fd{-1};
	termios_t tty, save;
	live_data dat;
	std::string out;

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
		dat.read_MS5611();
		dat.update_gps();
		dat.update_stemp();
		dat.update_ahrs();
		out = dat.get_json();
		std::cout << out << std::endl;
		write(uart_fd, out.c_str(), out.length());
		// printf("LENGTH OF OUTPUT: %u\n", strlen(out.c_str()));
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
