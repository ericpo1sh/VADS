#include <csignal>
#include <cstdio>
#include <cstring>
#include <errno.h>
#include <fcntl.h>
#include <iostream>
#include <sys/file.h>
#include <termios.h>
#include <unistd.h>

#define UART_DEV "/dev/ttyUSB0"

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

typedef struct termios termios_t;

static int tty_config(termios_t *tty, int port);
static void signal_SIGINT(int sig __attribute__((unused)));

volatile bool receiving = true;

/**
 * main - serial port communications
 * Return: 0, always
 */
int main(int argc __attribute__((unused)), char **argv) {
	int uart_fd = -1, read_len = 0, index = 0;
	termios_t tty, save;
	char buffer[256] = {0}, read_char = -1;

	if (argc != 2)
		return fprintf(stderr, "Please supply device (e.g. /dev/ttyUSB0)");
	uart_fd = open(argv[1], O_RDWR | O_NOCTTY);
	if (uart_fd < 0)
		return fprintf(stderr, "open error - %i: %s\n", errno, strerror(errno)), 1;
	if (tcgetattr(uart_fd, &tty))
		return fprintf(stderr, "tcgetattr error - %i: %s\n", errno, strerror(errno)), 1;
	save = tty;
	if (tty_config(&tty, uart_fd))
		return tcsetattr(uart_fd, TCSANOW, &save), 1;
	usleep(1000);
	signal(SIGINT, signal_SIGINT);
	while(receiving) {
		for (index = 0; (read_len = read(uart_fd, &read_char, 1)); ++index)
			buffer[index] = read_char;
		if (index)
			std::cout << buffer << std::endl;
		memset(buffer, '\x00', 256);
		fflush(stdout);
	}
	tcsetattr(uart_fd, TCSANOW, &save);
	close(uart_fd);
	putchar('\n');
	return 0;
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
	tty->c_cflag |= (CS8 | CLOCAL | CREAD);
	tty->c_cflag &= ~(CSIZE | CSTOPB | CRTSCTS | PARENB | PARODD);
	tty->c_iflag &= ~(IGNBRK | IXON | IXOFF | IXANY);
	tty->c_lflag = 0;
	tty->c_oflag = 0;
	tty->c_cc[VMIN] = 0;
	tty->c_cc[VTIME] = 10;
	if (tcsetattr(port, TCSANOW, tty))
		return fprintf(stderr, "tcsetattr error - %i: %s\n", errno, strerror(errno)), 1;
	return 0;
}

/**
 * signal_SIGINT - defines instructions upon SIGINT, as input to signal
 * @sig: input signal
 */
static void signal_SIGINT(int sig __attribute__((unused))) { receiving = false; }
