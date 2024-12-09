#ifndef _SOCKET_HPP_
#define _SOCKET_HPP_

#include <netinet/in.h>

class Socket {
public:
	Socket(char *ip,char *port);
	Socket();
	void output(const std::string& data);

private:
	int sockfd;
	struct sockaddr_in addr = {0};
};

#endif
