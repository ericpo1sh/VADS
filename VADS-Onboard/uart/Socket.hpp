#ifndef _SOCKET_HPP_
#define _SOCKET_HPP_

class Socket {
public:
	Socket(char *ip,char *port);
	Socket();
	void Socket::output(const std::string& data);

private:
	int sockfd;
	struct sockaddr_in addr;
	char line[80];
};

#endif
