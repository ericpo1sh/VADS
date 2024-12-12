#ifndef _WEBSOCKET_H_
#define _WEBSOCKET_H_

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

void websocket_init(websocketpp::server<websocketpp::config::asio>* server, int port);
void websocket_init(websocketpp::server<websocketpp::config::asio>* server);
void send_message(const std::string& message, websocketpp::server<websocketpp::config::asio>* s);
void on_message(websocketpp::server<websocketpp::config::asio>* s, websocketpp::connection_hdl hdl, websocketpp::server<websocketpp::config::asio>::message_ptr msg);
void on_open(websocketpp::server<websocketpp::config::asio>* s, websocketpp::connection_hdl hdl);
void on_close(websocketpp::server<websocketpp::config::asio>* s, websocketpp::connection_hdl hdl);


#endif