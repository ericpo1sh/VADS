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

// static int tty_config(termios_t *tty, int port);
// static void signal_SIGINT(int sig __attribute__((unused)));
// static void signal_SIGIO(int sig __attribute__((unused)));

volatile bool receiving = true, wait = true;

/**
 * main - serial port communications
 * Return: 0, always
 */
int main(void) {
	int uart_fd = -1, read_len = 0;
	termios_t tty, old;
	char buffer[256] = {0};

	uart_fd = open(UART_DEV, O_RDWR | O_NOCTTY);
	if (uart_fd < 0)
		return fprintf(stderr, "open error - %i: %s\n", errno, strerror(errno)), 1;
	tcgetattr(uart_fd, &old);
	// if (tty_config(&tty, uart_fd))
	// 	return tcsetattr(uart_fd, TCSANOW, &old), 1;
	bzero(&tty, sizeof(tty));
	// if (flock(uart_fd, LOCK_EX | LOCK_NB) == -1)
	// 	throw std::runtime_error("Serial port file descriptor already otherwise locked");
	// usleep(1000);
	tty.c_cflag = B9600 | CRTSCTS | CS8 | CLOCAL | CREAD;
	tty.c_iflag = IGNPAR | ICRNL;
	tty.c_oflag = 0;
	tty.c_lflag = ICANON;
	tty.c_cc[VMIN] = 1;
	tcflush(uart_fd, TCIFLUSH);
	tcsetattr(uart_fd, TCSANOW, &tty);
	// signal(SIGINT, signal_SIGINT);
	// signal(SIGIO, signal_SIGIO);
	while(receiving) {
		// putchar('.');
		// usleep(100000);
		// if (!wait) {
		// putchar('\n');
		read_len = read(uart_fd, buffer, 256);
		buffer[read_len] = '\x00';
		std::cout << buffer << std::endl;
		memset(buffer, '\x00', 256);
		// wait = true;
		// }
		// fflush(stdout);
	}
	tcsetattr(uart_fd, TCSANOW, &old);
	close(uart_fd);
	return 0;
}

// /**
//  * tty_config - sets flags for and configures termios data structure
//  * @tty: pointer to termios data structure
//  * @port: file descriptor for open serial port
//  * Return: 0 upon success, otherwise 1
//  */
// static int tty_config(termios_t *tty, int port) {
// 	if (tcgetattr(port, tty))
// 		return fprintf(stderr, "tcgetattr error - %i: %s\n", errno, strerror(errno)), 1;
// 	tty->c_cflag &= ~PARENB;
// 	tty->c_cflag &= ~CSTOPB;
// 	tty->c_cflag &= ~CSIZE;
// 	tty->c_cflag |= CS8;
// 	tty->c_cflag &= ~CRTSCTS;
// 	tty->c_cflag |= CREAD | CLOCAL;

// 	tty->c_lflag &= ~ICANON;
// 	tty->c_lflag &= ~ECHO;
// 	tty->c_lflag &= ~ECHOE;
// 	tty->c_lflag &= ~ECHONL;
// 	tty->c_lflag &= ~ISIG;

// 	tty->c_iflag &= ~(IXON | IXOFF | IXANY);
// 	tty->c_iflag &= ~(IGNBRK | BRKINT | PARMRK | ISTRIP | INLCR | IGNCR | ICRNL);

// 	tty->c_oflag &= ~OPOST;
// 	tty->c_oflag &= ~ONLCR;

// 	tty->c_cc[VTIME] = 100;
// 	tty->c_cc[VMIN] = 0;
// 	cfsetispeed(tty, B9600);
// 	cfsetospeed(tty, B9600);
// 	if (tcsetattr(port, TCSANOW, tty))
// 		return fprintf(stderr, "tcsetattr error - %i: %s\n", errno, strerror(errno)), 1;
// 	return 0;
// }

// /**
//  * signal_SIGINT - defines instructions upon SIGINT, as input to signal
//  * @sig: input signal
//  */
// static void signal_SIGINT(int sig __attribute__((unused))) { receiving = false; }

// /**
//  * signal_SIGIO - defines instructions upon SIGIO, as input to signal
//  * @sig: input signal
//  */
// static void signal_SIGIO(int sig __attribute__((unused))) { wait = false; }
