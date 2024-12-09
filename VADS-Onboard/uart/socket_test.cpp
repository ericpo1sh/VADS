#include <iostream>
#include <sys/socket.h>

#include "Socket.hpp"

int main(void) {
	Socket sock;
	char buff[384] = {0};

	sock = Socket();
	sock.receive(buff);
	std::cout << buff << std::endl;
}
