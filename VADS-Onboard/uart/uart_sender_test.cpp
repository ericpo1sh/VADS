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

typedef struct termios termios_t;

static int tty_config(termios_t *tty, int port);
static void signal_SIGINT(int sig);
static ssize_t prompt(char **input, std::size_t *len);
static int empty_input(char *input);

volatile bool sending = true;

/**
 * main - infinite loop responsible for prompt and serial port communications
 * Return: 0, always
 */
int main(int argc __attribute__((unused)), char **argv) {
	char *input = nullptr;
	std::size_t input_len = 0;
	int prompt_ret = 0, uart_fd = -1;
	termios_t tty, save;

	uart_fd = open(argv[1] ? argv[1] : UART_DEV, O_RDWR | O_NOCTTY);
	if (uart_fd < 0)
		return fprintf(stderr, "open error - %i: %s\n", errno, strerror(errno)), 1;
	if (tcgetattr(uart_fd, &tty))
		return fprintf(stderr, "tcgetattr error - %i: %s\n", errno, strerror(errno)), 1;
	save = tty;
	if (tty_config(&tty, uart_fd))
		return tcsetattr(uart_fd, TCSANOW, &save), 1;
	usleep(1000);
	signal(SIGINT, signal_SIGINT);
	while (sending) {
		prompt_ret = prompt(&input, &input_len);
		if (prompt_ret < 0)
			continue;
		write(uart_fd, input, strlen(input) - 1);
		// usleep(strlen(input) * 1000);
		std::cout << "SENDING: " << input;
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

/**
 * signal_SIGINT - defines instructions upon SIGINT, as input to signal
 * @sig: input signal
 */
static void signal_SIGINT(int sig __attribute__((unused))) { sending = false; }

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
