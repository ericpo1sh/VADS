#include <csignal>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <errno.h>
#include <fcntl.h>
#include <iostream>
#include <sys/file.h>
#include <termios.h>
#include <unistd.h>

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

typedef struct termios termios_t;

// static int tty_config(termios_t *tty, int port);
// static void signal_SIGINT(int sig);
static ssize_t prompt(char **input, std::size_t *len);
static int empty_input(char *input);

volatile bool sending = true;

/**
 * main - infinite loop responsible for prompt and serial port communications
 * Return: 0, always
 */
int main(void) {
	char *input = nullptr, buffer[256] = {0};
	std::size_t input_len = 0;
	int prompt_ret = 0, uart_fd = -1;
	termios_t tty, old;

	uart_fd = open(UART_DEV, O_RDWR);
	if (uart_fd < 0)
		return fprintf(stderr, "open error - %i: %s\n", errno, strerror(errno)), 1;
	tcgetattr(uart_fd, &old);
	// if (tty_config(&tty, uart_fd))
	// 	return tcsetattr(uart_fd, TCSANOW, &old), 1;
	// if (flock(uart_fd, LOCK_EX | LOCK_NB) == -1)
	// 	throw std::runtime_error("Serial port file descriptor already otherwise locked");
	tty.c_iflag = IGNBRK | IGNPAR;
	tty.c_oflag = 0;
	tty.c_lflag = 0;
	cfsetspeed(&tty, B9600);
	usleep(1000);
	// signal(SIGINT, signal_SIGINT);
	while (sending) {
		prompt_ret = prompt(&input, &input_len);
		if (prompt_ret < 0)
			continue;
		write(uart_fd, input, strlen(input) - 1);
		std::cout << "SENT: " << input;
		if (input)
			free(input), input = nullptr;
		memset(&buffer, '\x00', sizeof(buffer));
	}
	tcsetattr(uart_fd, TCSANOW, &old);
	close(uart_fd);
	return (0);
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

// 	tty->c_cc[VTIME] = 10;
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
// static void signal_SIGINT(int sig __attribute__((unused))) { sending = false; }

/**
 * prompt - gets line from input and maintains prompt
 * @input: input received from stdin
 * @len: the length of the input from stdin
 * Return: the number of characters read,
 *         -1 upon single line break,
 *         -2 if input is empty
 */
static ssize_t prompt(char **input, std::size_t *len) {
	ssize_t getline_out = 0, error = 0;

	if (isatty(STDIN_FILENO))
		write(STDOUT_FILENO, ": ", 2);
	getline_out = getline(input, len, stdin);
	if (getline_out == EOF)
		free(*input), exit(0);
	else if (!getline_out)
		return (-1);
	if (empty_input(*input))
		error = -2, free(*input), *input = nullptr;
	return !error ? getline_out : error;
}

/**
 * empty_input - verifies if input is only space characters
 * @input: input string
 * Return: 1 if length of string equal to number of whitespaces, 0 otherwise
 */
static int empty_input(char *input) {
	std::size_t iter = 0, spaces = 0;

	if (!input)
		return 1;
	for (; input[iter]; iter++)
		if (input[iter] == ' ' ||
			input[iter] == '\t' ||
			input[iter] == '\n' ||
			input[iter] == '\r')
			spaces++;
	return (spaces == strlen(input) ? 1 : 0);
}
