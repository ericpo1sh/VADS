#include <arpa/inet.h>
#include <cstdio>
#include <cstring>
#include <string>
#include <sys/socket.h>

#include "Socket.hpp"

Socket::Socket(char * ip,char * port) {
	sockfd = socket(AF_INET,SOCK_DGRAM,0);
	addr.sin_family = AF_INET;
	addr.sin_addr.s_addr = inet_addr(ip);
	addr.sin_port = htons(atoi(port));
}

Socket::Socket() {
	sockfd = socket(AF_INET,SOCK_DGRAM,0);
	addr.sin_family = AF_INET;
	addr.sin_addr.s_addr = inet_addr("127.0.0.1");
	addr.sin_port = htons(1337);
}

void Socket::send(const std::string data) {
	sendto(sockfd, data.c_str(), data.length(), 0, (struct sockaddr *)&addr, sizeof(addr));
}

void Socket::receive(char *buff) {
	recv(sockfd, buff, 384, MSG_WAITALL);
}
